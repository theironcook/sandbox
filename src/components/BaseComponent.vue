import Vue from 'vue'
import Component from 'vue-class-component'
import _ from 'lodash';
import { Model, ModelType, LinkedModel } from '@/store/types';


interface ModelLoadOptions { 
  createCopy?: boolean; // create a new copy or use the store's model
  defaultModel?: string; // if the model isn't loaded yet, what to use as a temp default
}

interface ModelLoadPropOptions extends ModelLoadOptions {
  defaultValue?: string;
}


type ModelOptions = {
  defaultModel?: any
}

// Mix this in to any component that needs to load / use models asynchronously from the API
// The model's store should have mixed in /asyncCore
@Component
export default class BaseComponentMixin extends Vue {

  // Must be created at component creation time so it's observable.  
  // All async model data will be bound at this root
  private readonly asyncModels: {[key: string]: any} = {};

  // invoking filter or sort will update the sortModels collection
  protected sortedModels: any = [];
  private readonly sortOrders: any = {};


  // modelType: the type of model you're looking for
  // id: the id of the model you want 
  // immediately returns an empty model (or a default model you specify) while background 
  // loading the real model asynchronously from the model's main store
  protected model(modelType: ModelType, id: string, {defaultModel}: ModelOptions = {}){    
    if(modelType && id){
      const modelKey = `${modelType}-${id}`;

      if(!this.asyncModels[modelKey]){
        Vue.set(this.asyncModels, modelKey, defaultModel || {});

        (async () => {
          this.asyncModels[modelKey] = await this.$store.dispatch(`${modelType}Store/fetchModel`, id, {root: true});
        })();
      }

      return this.asyncModels[modelKey];
    }
    else {
      return defaultModel || {};
    }
  }

  protected async model_async(modelType: ModelType, id: string, {defaultModel}: ModelOptions = {}){
    if(modelType && id){  
      const modelKey = `${modelType}-${id}`;

      if(!this.asyncModels[modelKey]){
        Vue.set(this.asyncModels, modelKey, defaultModel || {});

        this.asyncModels[modelKey] = await this.$store.dispatch(`${modelType}Store/fetchModel`, id, {root: true});        
      }

      return this.asyncModels[modelKey];
    }
    else {
      return defaultModel || {};
    }
  }

  // modelType: the type of the model you're looking for
  // parent: the model where the linked model reference lives
  // immediately returns an empty model (or a default model you specify) while background 
  // loading the real model asynchronously from the model's main store
  protected linkedModel(modelType: ModelType, propName: string, parent?: Model, {defaultModel}: ModelOptions = {}){    
    if(modelType && parent && parent[propName] && parent[propName].id){
      return this.model(modelType, parent[propName].id, {defaultModel});
    }
    else {
      return defaultModel || {};
    }
  }

  protected async linkedModel_async(modelType: ModelType, propName: string, parent?: Model, {defaultModel}: ModelOptions = {}){    
    if(modelType && parent && parent[propName] && parent[propName].id){
      return await this.model_async(modelType, parent[propName].id, {defaultModel});
    }
    else {
      return defaultModel || {};
    }
  }
}