<template>
  <section class="hero is-primary is-fullheight">
    <div>
      Test sorting and filtering: {{models.length}}
      <br>
      <br>
      Filter: <input class="control" type="text" v-model="filter"/>
      <table>
        <tr>
          <td>selected</td>
          <td> <a href="" @click.prevent="sortProjection('newId', {resolver: async (m) => m.newId})"> id </a> </td>
          <td> <a href="" @click.prevent="sortProjection('name')"> name </a> </td>
          <td> <a href="" @click.prevent="sortProjection('shortName')"> shortName </a> </td>
          <td> <a href="" @click.prevent="sortProjection('dateOfBirth')"> dateOfBirth </a> </td>
          <td> <a href="" @click.prevent="sortProjection('weight')"> weight </a> </td>
          <td> <a href="" @click.prevent="sortProjection('composite', {sortResolver: (m) => `${m.name}-${m.shortName}`})"> composite </a> </td>
        </tr>
        
        <tr v-for="model in getProjectedModels(this.models)" v-bind:key="model.id">
          <td><input class="control" type="checkbox"></td>
          <td>{{model.newId}}</td>
          <td>{{model.name}}</td>
          <td>{{model.shortName}}</td>
          <td>{{model.dateOfBirth}}</td>
          <td>{{model.weight}}</td>
          <td>{{model.name}}-{{model.shortName}}</td>
        </tr>
      </table>
      <br>
      <button class="button" @click.prevent="onAdd">Add</button>
      <br>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import VDaySelector from 'vuelendar/components/vl-day-selector.vue';
import moment from 'moment';
import _ from 'lodash';

type PropResolver = (val: any) => Promise<any>;

type SortOptions = {
  sortResolver?: PropResolver,
  projectionName?: string
}

type FilterOptions = {  
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

(<any>window).count = 0;

@Component
export default class Six extends Vue {
  
  @State(state => state['exampleStore'].models)
  private models!: any;

  private projections: {[projectionName: string]: Projection} = {};
  private projectedModels: {[projectionName: string]: any[]} = {default: []};

  private mounted(){
    this.initProjection(this.models);
  }

  private initProjection(sourceModels: any[], projectionName: string = 'default' ){
    Vue.set(this.projections, projectionName, {source: sourceModels, col: '', sortOrders: {}});
    
    const onSortInputsChanged = () => {      
      this.calcProjection(projectionName);
    };

    this.$watch(`projections.${projectionName}`, onSortInputsChanged);
    this.$watch(`projections.${projectionName}.source.length`, onSortInputsChanged);
    
    Vue.set(this.projectedModels, projectionName, _.clone(sourceModels));
  }

  
  private getProjection(projectionName: string){
    return this.projections[projectionName];
  }

  private getProjectedModels(sourceModels: any[], projectionName: string = 'default'){
    return this.projectedModels[projectionName];
  }
  
  private async calcProjection(projectionName: string){
    let models;
    
    const projection = this.getProjection(projectionName);    

    if(projection.filter){
      const filterUCase = projection.filter.toUpperCase();

      if(_.isFunction(projection.filterResolver)){        
        const filterResolver: any = projection.filterResolver;
        models = (await Promise.all(projection.source.map(async model => {
          if(projection.filter === '' || ((await filterResolver(model)).toUpperCase().indexOf(filterUCase) !== -1)){
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

    models.sort((a: any, b: any) => {
      if(projection.sortKey){        
        let propA, propB, result;
        
        if(projection.sortResolver){
          propA = projection.sortResolver(a);
          propB = projection.sortResolver(b);
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

  private sortProjection(sortKey: string, {sortResolver, projectionName='default'}: SortOptions = {}): void {    
    const projection = this.getProjection(projectionName);
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

  private filter: string = '';

  @Watch('filter')
  private onFilterStringChanged(){
    this.filterProjection(this.filter, async (m) => `${m.name}${m.shortName}` );
  }

  private filterProjection(filter: string, filterResolver: string | PropResolver, {projectionName='default'}: FilterOptions = {}): void {
    const projection = this.getProjection(projectionName);
    const newValues = {filter, filterResolver};
    this.projections[projectionName] = Object.assign({}, this.projections[projectionName], newValues);
  }

  private onAdd(){
    this.models.push({newId: this.models.length+1, name: Math.random().toFixed(5).toString().substring(2), dateOfBirth: new Date(), shortName: Math.random().toFixed(3).toString().substring(3),  weight: Math.floor(Math.random()*100)});
  }

}
</script>

<style lang="scss">

  table {
    margin-left: 30px;
  }

  td {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
  }

  button {
    margin-left: 10px;
  }

</style>