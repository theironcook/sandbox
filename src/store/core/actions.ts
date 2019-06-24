import { Commit } from 'vuex';
import { CoreState, Model } from '@/store/types';
import axios from 'axios';


const defaultMaxPageTotal = 2500; // we can of course increase this if needed
const defaultMaxPageSize = 250;


// Helper functions
const createFilterUrlParams = function(filter: string, page?: number): string{
  let params: string = `pageSize=${defaultMaxPageSize}`;

  // don't include filter unless it's a non empty string
  if(filter){
    params += `&filter=${filter}`;
  }
  if(page){
    params += `&page=${page}`;
  }

  return params;
};

const loadPaginatedModels = async function({state, commit, preCommit, filter}: {state: CoreState, commit: Commit, preCommit?: Function, filter: string}): Promise<object[]>{  
  const fetchedModels = [];

  const firstResponse = await axios.get(`${state._url}?${createFilterUrlParams(filter)}`);
  (<any>fetchedModels).push(...firstResponse.data.data);
  // Allow a handler to perform a bulk load before data is commited to the store
  if(preCommit){
    // Bart todo - I doubt I need to await this call - better to not block root model loading
    preCommit(firstResponse);
  }

  commit(`${state._storeName}/addModels`, firstResponse.data.data, {root: true});

  // some models don't support pagination
  if(firstResponse.data.meta && firstResponse.data.meta.pagination){  
    const paginationTotal = firstResponse.data.meta.pagination.total;

    if(paginationTotal > defaultMaxPageTotal){
      console.error(`Oops, looks like you tried to bulk load a model type with more than the default limit of ${defaultMaxPageTotal}. url=${state._url}, totalModelCount=${paginationTotal}`);
    }
    else if(paginationTotal > defaultMaxPageSize) {
      const paginatedPromises = []; 

      // Kick off all of the bulk model loads to happen in parallel
      for(let pageIndex = 1; pageIndex * defaultMaxPageSize < paginationTotal; pageIndex++){
        (<any>paginatedPromises).push(axios.get(`${state._url}?${createFilterUrlParams(filter, pageIndex+1)}`).then((response) => {            
          (<any>fetchedModels).push(...response.data.data);
          if(preCommit){
            preCommit(response);
          }                        
          commit(`${state._storeName}/addModels`, response.data.data, {root: true});
        }));
      }
      
      // Even though we loaded all of the data in parallel, we can't return from this entire function until all promises have completed
      await Promise.all(paginatedPromises);
    }
  }

  return fetchedModels;
};



export const actions = {  
  
  async save({commit, state}: {commit: Commit, state: CoreState},  model?: Model) : Promise<Model> {
    if(!model){
      model = state.selectedCopy;
    }

    if(model){
      let response: any;
      if(model.id){
        response = await axios.put(`${state._url}/${model.id}`, model);
        // The api might have added calculated fields so it's best to update the store
        commit(`${state._storeName}/update`, response.data.data, {root: true});
      }
      else {
        response = await axios.post(state._url, model);
        commit(`${state._storeName}/addModels`, [response.data.data], {root: true});
      }
      
      // Return the updated model in the store
      return this.fetchModel({commit, state}, {id: model.id || response.data.data.id});
    }
    else {
      throw 'Tried to save but there was no selectedCopy to save in the store';
    }
  },

  async delete({commit, state}: {commit: Commit, state: CoreState}, model: Model): Promise<void> {    
    await axios.delete(`${state._url}/${model.id}`);
    commit('delete', model);
  },



  async fetchModel({commit, state}:{commit: Commit, state: CoreState}, {id}:{id: string}): Promise<Model>{
    if(!state._promiseStore.get(id)){

      const loadPromise = state._promiseStore.create(id);

      (async () => {
        let model = state.models.find((model: any) => model.id === id);

        if(!model){
          // If the model isn't in the state, load it async and then add it to the store
          try {
            const response = await axios.get(`${state._url}/${id}`);          
            commit(`${state._storeName}/addModels`, [response.data.data], {root: true});

            // Get the model just added to the store via commit (or added just before this code tried to add the model to the store)
            model = state._storeSearch.findById(id);
          }
          catch(err){
            loadPromise.reject(err); // probably want better error handling
          }
        }

        loadPromise.resolve(model);
      })();
    }

    return state._promiseStore.get(id).promise;
  },

  async fetchModels({commit, state}: {commit: Commit, state: CoreState}, {ids, preCommit}:{ids: string[], preCommit?: Function}): Promise<Model[]>{        
    return new Promise(async (resolve, reject) => {
      // Gather the model ids that don't have promises yet
      const idsNotPromised = state._promiseStore.getKeysNotPromised(ids);
      
      if(idsNotPromised.length > 0){
        try {
          // Create new promises for new models we're about to load
          idsNotPromised.forEach((id: any) => {
            state._promiseStore.create(id);
          });

          const filter = `${encodeURI(`id->[${idsNotPromised}]`)}`;
          await loadPaginatedModels({state, commit, preCommit, filter});
          
          // resolve all of the individual promises per model
          idsNotPromised.forEach((id: any) => {
            // find the model in the store. The models we retrieved aren't necessarily
            // the models in the store due to other filter loading happening at the same time
            const model = state._storeSearch.findById(id);

            if(model){
              state._promiseStore.get(id).resolve(model);
            }
            else {
              state._promiseStore.get(id).reject(`modelId=${id} not found for getUrl=${state._url}.`);
            }
          });
        }
        catch(err){
          // Need to log this
          reject(err);
        }
      }

      // Get all of the promises for each of the ids in the original request
      const loadPromises: Promise<any>[] = [];
      ids.map((id) => loadPromises.push(state._promiseStore.get(id).promise));

      // Resolve the promise when all of the models have been loaded
      resolve(await Promise.all(loadPromises));
    });
  },

  async fetchModelsByFilter({commit, state}: {commit: Commit, state: CoreState}, {filter, preCommit}:{filter: string, preCommit?: Function}): Promise<Model[]>{
    if(!state._promiseStore.get(filter)){
      const loadPromise = state._promiseStore.create(filter);
      
      (async () => {
        try {
          // Fetch all of the models from the API.  All unique loaded models will be commited to the store
          const fetchedModels = await loadPaginatedModels({state, commit, preCommit, filter});

          // Now, add all of the returned models to the promiseStore as individual models in case
          // someone asks for these models later via the AsyncModelLoader functions

          // collect the ids of the models that were returned by the filter
          const loadedIds = fetchedModels.map((model: any) => model.id);

          // Get the model just added to the store via commit (or added just before this code tried to add the model to the store)
          const loadedModels: any = [];
          loadedIds.forEach((id: string) => {
            const model = state._storeSearch.findById(id);

            if(!state._promiseStore.get(id)){
              state._promiseStore.create(id);

              // resolve or reject the promise immediately
              if(model){
                state._promiseStore.get(id).resolve(model);
              }
              else {
                debugger;
                // Not sure how this could happen but just to be safe
                state._promiseStore.get(id).reject(`Model ${id} was not found in the store. this.getUrl=${state._url}`);
              }
            }
            
            if(model){
              loadedModels.push(model);
            }
          });
          
          // now finally resolve the promise for the filter with all of the loaded models
          loadPromise.resolve(loadedModels);
        }
        catch(err){
          loadPromise.reject(err); // probably want better error handling
        }
      })();
    }

    return state._promiseStore.get(filter).promise;
  },

  select({state, commit}, selected: Model): Promise<void>{
    commit(`${state._storeName}/select`, selected, {root: true});
    return Promise.resolve();
  },

  updateSelectedCopy({state, commit}, tuple: {propName: string, value: any}): Promise<void> {    
    commit(`${state._storeName}/updateSelectedCopy`, tuple, {root: true});
    return Promise.resolve();
  }
};
