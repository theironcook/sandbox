import { Module } from 'vuex';
import { CoreState, RootState, StoreType, Model, ModelBaseUrlType } from '@/store/types';
import { actions } from './actions';
import { mutations } from './mutations';
import PromiseStore from '@/store/core/PromiseStore';
import StoreSearch from '@/store/core/StoreSearch'

const models: Model[] = [];

export const state: CoreState = {
  models,
  selected: undefined,
  selectedCopy: <any>{fieldOne: 'hey there'},
  _url: ModelBaseUrlType.examples,
  _storeName: StoreType.ExampleStore.toString(),
  _promiseStore: new PromiseStore(),
  _storeSearch: new StoreSearch(models)
};

export const exampleStore: Module<CoreState, RootState> = {
    namespaced: true,
    state,
    actions,
    mutations
};
