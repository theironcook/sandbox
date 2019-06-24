import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import exampleStore from './example';

Vue.use(Vuex);
//console.log('here i am ', exampleStore);

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',

  state: {
      version: '1.0.0'
  },

  modules: {       
      exampleStore
  }
};

export default new Vuex.Store<RootState>(store);