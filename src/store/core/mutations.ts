import { MutationTree } from 'vuex';
import { CoreState, Model } from '@/store/types';
import { cloneDeep } from 'lodash';

export const mutations: MutationTree<CoreState> = {  
  
  // Add models to the store
  // Do not add any models that are already in the store - keyed off of the model.id
  addModels(state: any, models: object[]){
    const newModels = models.filter((model: any) => !state._storeSearch.findById(model.id));
    state.models.push(...newModels);
  },

  select(state, model: Model){
    state.selected = model;
    state.selectedCopy = cloneDeep(state.selected);
  },
  
  update(state: any, updated: any) {
    const existing = state._storeSearch.findById(updated.id);
    Object.assign(existing, updated);
  },  

  delete(state, model: Model) {
    console.log('invoked core delete');
    // Doing this manually is faster than _.remove because it stops at the first item found
    const deleteIndex = state._storeSearch.findIndexById(model.id);
    if(deleteIndex !== -1){
      state.models.splice(deleteIndex, 1);
    }

    // select another model if deleteMe was the selected one
    if(state.selected && state.selected.id === model.id && state.models.length > 0){
      state.selected = state.models[0];
      state.selectedCopy = cloneDeep(state.selected);
    }
  },

  updateSelectedCopy(state, {propName, value}: {propName: string, value: string}){
    if(!state.selectedCopy){
      throw `Tried to update a store selectedCopy that was null. key=${propName}, value=${value}`;
    }
    else {
      state.selectedCopy[propName] = value;
    }
  }

};

