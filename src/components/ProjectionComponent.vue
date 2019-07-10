import Vue from 'vue'
import Component from 'vue-class-component'
import _ from 'lodash';
import { Model, ModelType, LinkedModel } from '@/store/types';
import BaseComponentMixin from './BaseComponentMixin';
import { asyncTimSort } from '@/utils/AsyncTimSort';

export type PropResolver = (val: any) => Promise<string|number> | string | number;

export type SortOptions = {
  sortResolver?: PropResolver,
  projectionName?: string
}

export type FilterOptions = {
  projectionName?: string
}

type Projection = {
  source: any[],
  sortKey?: string,
  sortOrders: {[key: string]: number},
  sortResolver?: PropResolver,
  filter?: string,
  filterResolver?: string | PropResolver,  
}

// Usage:
// Mixin to components that you need sorting or filtering.
// In the component.mounted handler, invoke initProjection and pass in your source array.  This initializes the projection.
// In your template's v-for or other tags, invoke getProjectedModels() to get the projection.  This projection array will be 
//   reactive whenever models are added/removed to the source array or when you invoke sortProjection or filterProjection
//
// You can have multiple projections in a component if necessary by defining the projectionName parameter in all functions (initProjection, getProjectedModels etc.)
//
// sortProjection: takes a sort key which can either be a model's actual property name or a unique identifier for the sorting column.
//   This function also can take an optional sortResolver function. This function takes a model and returns a value that can be sorted.
//   The sortResolver can be used in conjunction with the BaseComponentMixin.model, linkedModel functions.  
//   You can define the sortResolver to return anything like composite values that  can then be sorted.  The sortResolver can be defined as async if you 
//   are returning values asynchronously.  Most of the time the BaseComponentMixin.linkedModel should be sufficient.  You can use the makeLMResolver() function
//   to quickly create a resolver that leverages BaseComponentMixin.linkedModel.
//   Invoking sortProjection mutiple times for the same sortKey will invert the sort order internally.
//
// filterProjection: takes a filter (what you are looking for) and a filterResolver.  The filterResolver can be a string
//   which will then be used as a model's property name.  So, if you pass a filter='Bob' and a filterResolver='firstName', then all models
//   that have a property of 'firstName' that have values that match 'BOB' will be included in the projection.
//   The filterResolver can also be a function that follows the same rules as the sortResolver mentioned above.
@Component
export default class ProjectionMixin extends Vue {

  private projections: {[projectionName: string]: Projection} = {};

  private projectedModels: {[projectionName: string]: any[]} = {default: []};

  protected initProjection(source: any[], projectionName: string = 'default' ){
    Vue.set(this.projections, projectionName, {source, sortOrders: {}});
    
    const onSortInputsChanged = () => {      
      this.calcProjection(projectionName);
    };

    this.$watch(`projections.${projectionName}`, onSortInputsChanged);
    this.$watch(`projections.${projectionName}.source.length`, onSortInputsChanged);
    
    Vue.set(this.projectedModels, projectionName, _.clone(source));
  }

  protected getProjectedModels(projectionName: string = 'default'){
    return this.projectedModels[projectionName];
  }

  protected makeLMResolver(modelType: ModelType, parentPropName: string, propName: string){
    return (model: Model) => {
      return _.get((<any>this).linkedModel(modelType, parentPropName, model), propName);
    };
  }

  protected sortProjection(sortKey: string, {sortResolver, projectionName='default'}: SortOptions = {}): void {    
    const projection = this.projections[projectionName];
    const newValues:any = {sortKey};

    if(!projection.sortOrders[sortKey]){
      // Have to make this nested property observable
      Vue.set(projection.sortOrders, sortKey, 1);
    }
    else {
      projection.sortOrders[sortKey] *= -1;
    }

    newValues.sortOrders = projection.sortOrders;

    if(sortResolver){
      newValues.sortResolver = sortResolver;
    }

    this.projections[projectionName] = Object.assign({}, this.projections[projectionName], newValues);
  }  

  protected filterProjection(filter: string, filterResolver: string | PropResolver, {projectionName='default'}: FilterOptions = {}): void {    
    const newValues = {filter, filterResolver};
    this.projections[projectionName] = Object.assign({}, this.projections[projectionName], newValues);
  }

  private async calcProjection(projectionName: string){
    let models;
    
    const projection = this.projections[projectionName];

    if(projection.filter){
      const filterUCase = projection.filter.toUpperCase();

      if(_.isFunction(projection.filterResolver)){        
        const filterResolver: any = projection.filterResolver;
        models = (await Promise.all(projection.source.map(async model => {
          if((await filterResolver(model)).toUpperCase().indexOf(filterUCase) !== -1){
            return model;
          }
        }))).filter(model => model);            
      }
      else {
        if(!_.isString(projection.filterResolver)){
          throw 'projections can only be filtered via functions or strings that act as property keys';
        }        

        models = projection.source.filter((mod: any) => {          
          if(mod[<string>projection.filterResolver]){
            return mod[<string>projection.filterResolver].toUpperCase().indexOf(filterUCase) !== -1;
          }
          else {
            return false; // ?? no value means it doesn't match the filter??
          }          
        });
      }
    }
    else {
      models = _.clone(projection.source);
    }

    await asyncTimSort(models, async (a: any, b: any) => {
      if(projection.sortKey){        
        let propA, propB, result;
        
        if(projection.sortResolver){
          propA = await projection.sortResolver(a);
          propB = await projection.sortResolver(b);
        }
        else {
          // then sortKey should be the same as the property name
          propA = a[projection.sortKey];
          propB = b[projection.sortKey];
        }

        if(_.isString(propA) && _.isString(propB)){
          result = propA.toUpperCase().localeCompare(propB.toUpperCase());
        }
        else {
          result = propA - propB;
        }

        if(projection.sortOrders[projection.sortKey]){
          result *= projection.sortOrders[projection.sortKey];
        }
        
        return result;
      }
      else {
        return 0;
      }
    });

    this.projectedModels[projectionName] = models;
  }

}