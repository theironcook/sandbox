import { Model } from '@/store/types';
import { createDecorator } from 'vue-class-component';


type BindPropOptions = {
  modelName?: string,
  updateActionName?: string,
  getFormatter?: (value: any) => string,
  setFormatter?: (value: string) => {cancelSetter?: boolean, value?: any},
  propName?: string
}

// Make it easy to edit fields in a form.
// Relies on the store to have the action updateSelectedCopy and a state variable named selectedCopy
export const BindProp = function(storeName: string, {modelName='selectedCopy', updateActionName='updateSelectedCopy', getFormatter, setFormatter, propName}: BindPropOptions = {}){
  return createDecorator(function (options: any, key: string){
    if(!options.computed){
      options.computed = {};
    }
    
    if(!propName){
      // propName defaults to the same name as the component property name if it wasn't defined (most of the time)
      propName = key;
    }

    options.computed[key] = {
      get: function(){
        const selectedCopy = this.$store.state[storeName][modelName];

        if(selectedCopy){
          let value = selectedCopy[<string>propName];

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
        if(this.$store.state[storeName][modelName]){
          if(setFormatter){
            const formattedValue = setFormatter(value);
            if(!formattedValue.cancelSetter){
              this.$store.dispatch(`${storeName}/${updateActionName}`, {propName, value: formattedValue.value});
            }
          }
          else {
            this.$store.dispatch(`${storeName}/${updateActionName}`, {propName, value});
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