import { Model } from '@/store/types';
import { createDecorator } from 'vue-class-component';


type BindPropOptions = {
  selectedModelName: string,
  updateActionName: string,
  getFormatter?: (value: any) => string,
  setFormatter?: (value: string) => {cancelSetter?: boolean, value?: any}
}

const defaultBindPropOptions = {
  selectedModelName: 'selectedCopy',
  updateActionName: 'updateSelectedCopy'
}

// Make it easy to edit fields in a form.
// Relies on the store to have the action updateSelectedCopy and a state variable named selectedCopy
export const BindProp = function(storeName: string, {selectedModelName, updateActionName, getFormatter, setFormatter}: BindPropOptions = defaultBindPropOptions){
  return createDecorator(function (options: any, key: string){    
    if(!options.computed){
      options.computed = {};
    }

    options.computed[key] = {
      get: function(){
        const selectedCopy = this.$store.state[storeName][selectedModelName];

        if(selectedCopy){
          let value = selectedCopy[key];

          if(getFormatter){
            value = getFormatter(value);
          }

          return value;
        }
        else {
          return undefined;
        }
      },

      set: function(value){
        if(this.$store.state[storeName][selectedModelName]){
          if(setFormatter){
            const formattedValue = setFormatter(value);
            if(!formattedValue.cancelSetter){
              this.$store.dispatch(`${storeName}/${updateActionName}`, {propName: key, value: formattedValue.value});
            }
          }
          else {
            this.$store.dispatch(`${storeName}/${updateActionName}`, {propName: key, value});
          }                    
        }
      }
    }
  });
};

export const BindSelected = function(storeName: string){
  return createDecorator(function (options: any, key: string){
    
    if(!options.computed){
      options.computed = {};
    }

    options.computed[key] = {
      get: function(){
        return this.$store.state[storeName]['selected'];
      },

      set: function(model: Model){
        this.$store.dispatch(`${storeName}/select`, model);
      }
    }
  });
};