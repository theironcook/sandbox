import { Module } from 'vuex';
import { CoreState, RootState, StoreType, Model, ModelBaseUrlType } from '@/store/types';
import { actions } from './actions';
import { mutations } from './mutations';
import { Example } from './types';
import PromiseStore from '@/store/core/PromiseStore';
import StoreSearch from '@/store/core/StoreSearch'
import moment from 'moment';

const models: Model[] = <Example[]>[
  {id: '1', name: 'val one', shortName: 'v1', dateOfBirth: moment('8/1/1976')}, 
  {id: '2', name: 'val two', shortName: 'v2', dateOfBirth: moment('1/21/2003')}, 
  {id: '3', name: 'val three', shortName: 'v3', dateOfBirth: moment('6/8/2006')}];

export const state: CoreState = {
  models,
  selected: undefined,
  selectedCopy: undefined,
  _url: ModelBaseUrlType.examples,
  _storeName: StoreType.ExampleStore.toString(),
  _promiseStore: new PromiseStore(),
  _storeSearch: new StoreSearch(models)
};

const exampleStore: Module<CoreState, RootState> = {
    namespaced: true,
    state,
    actions,
    mutations
};

export default exampleStore;
