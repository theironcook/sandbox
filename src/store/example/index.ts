import { Module } from 'vuex';
import { CoreState, RootState, StoreType, Model, ModelBaseUrlType } from '@/store/types';
import { actions } from './actions';
import { mutations } from './mutations';
import { Example } from './types';
import PromiseStore from '@/store/core/PromiseStore';
import StoreSearch from '@/store/core/StoreSearch'
import moment from 'moment';

const models: Model[] = <Example[]>[
  {newId: 1, name: 'Randall', shortName: 'Randy', dateOfBirth: moment('8/1/1976'), weight: 110}, 
  {newId: 2, name: 'Stephen', shortName: 'a', dateOfBirth: moment('1/21/2003'), weight: 67}, 
  {newId: 3, name: 'Stephen', shortName: 'b', dateOfBirth: moment('6/8/2006'), weight: 160},
  {newId: 4, name: 'Alex', shortName: 'Al', dateOfBirth: moment('6/9/2006'), weight: 140},
  {newId: 4, name: 'Alex', shortName: 'Ali', dateOfBirth: moment('6/10/2006'), weight: 141}
];

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
