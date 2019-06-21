import { createDecorator } from 'vue-class-component';

export const Bindable = function(storeName: string){
  return createDecorator(function (options: any, key: string){
    
    if(!options.computed){
      options.computed = {};
    }

    options.computed[key] = {

      get: function(){
        return this.$store.state[storeName][key];
      },

      set: function(value: any){
        console.log('set to ', value);
      }
    }
  });
};