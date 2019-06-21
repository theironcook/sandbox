import {Model} from '@/store/types';

export default class StoreSearch {
  private readonly modelsById: {[key: string]: Model} = {};

  constructor(private readonly models: Model[]){

  }

  findById(id: string): Model {
    if(!this.modelsById[id]){
      // try to find it in the storeArray and cache it
      const model: any = this.models.find((check: any) => {return check.id === id;});
  
      if(model){
        this.modelsById[id] = model;
      }
    }
  
    return this.modelsById[id];
  }

  findIndexById(id: string): number {
    return this.models.findIndex((model: Model) => {
      return model.id === id;
    });
  }
}
