import { Model, LinkedModel } from '@/store/types';
import { createDecorator } from 'vue-class-component';


// if the store name isn't defined, see if there is a getter on the component to get the default store name
const computeStoreName = function(target: any, storeName?: string){  
  if(!storeName){
    if(target.computed['defaultStoreName']){
      storeName = target.computed['defaultStoreName'].get();
    }
    else {
      throw 'BindProp was invoked but the store was not specified and no default value was passed to the decorator.';
    }
  }

  return storeName;
}

type BindStoreModelOptions = {
  storeName?: string,
  selectedModelName?: string,
  updateActionName?: string
};

// 2 way binding with a store's selected model.  Useful for components that can update the store's selected model.
// Example: How to link a components theSelectedModel property with the patient store's selected model:
//   @BindSelected(StoreType.PatientStore.toString()))
//   private theSelectedModel!: Patient; 
// In more advanced situations, you can specify the selectedModelName and updateActionName with non default values for other root
// items in the store that you want to bind to.
// You can specify a component's defaultStoreName() and omit specifying the storeName as an option.
export const BindStoreModel = function({storeName, selectedModelName = 'selected', updateActionName='select'}: BindStoreModelOptions = {}){
  return createDecorator(function (target: any, key: string){
    
    const computedStoreName = computeStoreName(target, storeName);

    if(!target.computed){
      target.computed = {};
    }

    target.computed[key] = {
      get: function(){
        return this.$store.state[computedStoreName][selectedModelName];
      },

      set: function(model: Model){
        this.$store.dispatch(`${computedStoreName}/${updateActionName}`, model);
      }
    }
  });
};


type BindPropOptions = BindStoreModelOptions & {  
  getFormatter?: (value: any) => any,
  setFormatter?: (value: string) => {cancelSetter?: boolean, value?: any},
  propName?: string
}

// 2 way binding between a store model's prop.
// Example: Bind the patient store's selectedCopy.firstName property:
//   @BindProp({storeName: StoreType.PatientStore.toString()})
//   private firstName!: string;
//
// Option defaults / explination:
// storeName: The component's defaultStoreName() getter if it's defined.  What store to locate the model.
// selectedModelName: selectedCopy.  What root model in the store to use.
// updateActionName: updateSelectedCopy.  What store action to invoke when updating the model.
// getFormatter: undefined.  A function that takes the prop value and converts it to the UI format.
// setFormatter: undefined.  A function that takes the prop value entered in the UI and converts it the model's format.  Can be cancelled.
// propName: The field name where the @BindProp decorator is used.  If the component field name doesn't match the model name, set this property to match the model field name.
export const BindProp = function({storeName, selectedModelName='selectedCopy', updateActionName='updateSelectedCopy', getFormatter, setFormatter, propName}: BindPropOptions = {}){
  return createDecorator(function (target: any, key: string){    
    if(!target.computed){
      target.computed = {};
    }    

    const computedStoreName = computeStoreName(target, storeName);
    const computedPropName = propName || key;

    target.computed[key] = {
      get: function(){
        const selectedCopy = this.$store.state[computedStoreName][selectedModelName];

        if(selectedCopy){
          let value = selectedCopy[computedPropName];

          if(getFormatter){
            value = getFormatter(value);
          }

          return value;
        }
        else {
          return undefined;
        }
      },

      set: function(value: any){
        if(this.$store.state[computedStoreName][selectedModelName]){
          if(setFormatter){
            const formattedValue = setFormatter(value);
            if(!formattedValue.cancelSetter){
              this.$store.dispatch(`${computedStoreName}/${updateActionName}`, {propName: computedPropName, value: formattedValue.value});
            }
          }
          else {
            this.$store.dispatch(`${computedStoreName}/${updateActionName}`, {propName: computedPropName, value});
          }                    
        }
      }
    }
  });
};

// For binding a property that is a linked model.  
// Basically same as BindProp but with a default getFormatter/setFormatter that can deal with Linked Models
export const BindPropLM = function({storeName, selectedModelName, updateActionName, propName}: BindPropOptions = {}){
  
  const getFormatter = function(value: LinkedModel){
    if(value){
      return value.id;
    }
    else {
      return undefined;
    }
  };

  const setFormatter = function(id: string){
    if(id || id === null){
      return {value:  id === null ? null : {id}};
    }
    else {
      return {cancelSetter: true};
    }
  };

  return BindProp({storeName, selectedModelName, updateActionName, getFormatter, setFormatter, propName});
};