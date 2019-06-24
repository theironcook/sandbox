import { MutationTree } from 'vuex';
import { CoreState } from '@/store/types';
import { Example } from './types';

// You can't invoke mutations from other mutations via Vuex but you can directly invoke them
import {mutations as coreMutations} from '@/store/core/mutations';

export const mutations: MutationTree<CoreState> = {  
  addModels(state: CoreState, models: Example[]){
    coreMutations.addModels(state, models);
  },

  select(state: CoreState, model: Example){
    coreMutations.select(state, model);
  },

  update(state: CoreState, model: Example){
    coreMutations.update(state, model);
  },

  delete(state: CoreState, model: Example) {    
    coreMutations.delete(state, model);
  },

  updateSelectedCopy(state: CoreState, tuple: {propName: string, value: any}) {    
    coreMutations.updateSelectedCopy(state, tuple);
  }
};
