<template>
  <div class="home">
    One

    <hr>
    Input: {{sortingInput}}
    <hr>

    <table>
      <tr>
        <td><a href="" @click.prevent="sort('id')">id</a></td>
        <td><a href="" @click.prevent="sort('first')">first</a></td>
        <td><a href="" @click.prevent="sort('last')">last</a></td>
        <td><a href="" @click.prevent="sort('age')">age</a></td>
      </tr>
      <tr v-for="model in getSortedModels()" v-bind:key="model.id">
        <td>{{model.id}}</td>
        <td>{{model.first}}</td>
        <td>{{model.last}}</td>
        <td>{{model.age}}</td>
      </tr>
    </table>

    <br>
    <button class="button" @click="onAdd">Add</button>
    <br>
    <br>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import _ from 'lodash';

@Component
export default class Seven extends Vue {

  private models = [
    {id: 1, first: 'Bart', last: 'Wood', age: 42},
    {id: 3, first: 'Jack', last: 'Wood', age: 56},
    {id: 2, first: 'Jack', last: 'Johnson', age: 48},
    {id: 4, first: 'Craig', last: 'Jensen', age: 32}
    ];

  private sortingInput: any = {};
  private sortedModels: any = {};

  private mounted(){
    this.initSorting();
  }

  private getSortedModels(name: string = 'default'){
    return this.sortedModels[name];
  }

  private initSorting(name: string = 'default'){
    Vue.set(this.sortingInput, name, {source: this.models, col: '', sortOrders: {}});
    
    const onSortInputsChanged = () => {
      console.log('onSortInputsChanged');
      setTimeout( () => {
        this.sortedModels[name] = _.clone(this.sortingInput[name].source).sort((a: any, b: any) => {
          return this.sortingInput[name].sortOrders[this.sortingInput[name].col] * (a[this.sortingInput[name].col] -  b[this.sortingInput[name].col]);
        })
      }, 2);
    };

    this.$watch(`sortingInput.${name}`, onSortInputsChanged);
    this.$watch(`sortingInput.${name}.source.length`, onSortInputsChanged);
    
    Vue.set(this.sortedModels, name, _.clone(this.models));
  }
  


  //private sortedModels = this.models;

  private sort(col: string){
    const sortOrders = this.sortingInput.default.sortOrders;

    if(!sortOrders[col]){
      sortOrders[col] = 1;
    }
    else {
      sortOrders[col] *= -1;
    }

    this.sortingInput.default = Object.assign({}, this.sortingInput.default, {col, sortOrders}); 
  }



  private onAdd(){
    this.models.push({id: this.models.length+1, first: Math.random().toFixed(3).toString().substring(2), last: Math.random().toFixed(3).toString().substring(2), age: Math.floor(Math.random()*100)});
  }

}
</script>