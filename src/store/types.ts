import PromiseStore from '@/store/core/PromiseStore';
import StoreSearch from '@/store/core/StoreSearch';
import ExampleStore from '@/store/example';

export interface Model {
  id: string,
  type?: string,
  url?: string
}


export abstract class CoreState {
  models: Array<Model>;  
  selected?: Model;
  selectedCopy?: Model;
  _storeName: string;
  _url: string;
  _promiseStore: PromiseStore;
  _storeSearch: StoreSearch;
};


export interface RootState {
  version: string;
  exampleStore: ExampleStore;
}


export enum ModelType{
  example = 'example',  
};

export enum StoreType {
  ExampleStore = ModelType.example + 'Store'
}

export enum ModelBaseUrlType {
  examples = 'examples'
}
