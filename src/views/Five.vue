<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">      
      <div class="container">
        <div class="columns is-centeredz">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <form class="box">
              <div class="field has-text-centered">
                <img src="../assets/logo2.png" width="167"/>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input class="input" type="email" placeholder="e.g. alex@smith.com" required>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                </div>
              </div>
              
              <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left">
                  <input class="input" type="password" placeholder="********" required>
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
              </div>                                          
              <div class="field">
                <label class="checkbox">
                  <input type="checkbox">
                  Remember me
                </label>
              </div>
              <div class="field">
                <button class="button is-success">
                  Login
                </button>
              </div>

              <hr>
              Example Date Picker

              <day-picker :selectedDate="selectedDate" @update:selectedDate="selectedDate=$event"/>
              
              <hr>
              Example Form
              <div class="field">
                <label class="label">Selected Model</label>
                <div class="control select">
                  <select v-model="selected">
                    <option v-for="model in models" v-bind:key="model.id" :value="model">
                      {{model.name}}
                    </option>
                  </select>
                </div>
              </div>

              <div class="field">
                <label class="label">Name</label>
                <div class="control has-icons-left">
                  <input class="input" placeholder="Name" required v-model="name">
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                </div>
              </div>   

              <div class="field">
                <label class="label">Short Name</label>
                <div class="control has-icons-left">
                  <input class="input" placeholder="Short Name" required v-model="shortName">
                  <span class="icon is-small is-left">
                    <i class="fa fa-bar-chart"></i>
                  </span>
                </div>
              </div>

              <div class="field">
                <label class="label">Birth Date</label>
                <div class="control has-icons-left">
                  <input class="input" placeholder="MM-DD-YYYY" required v-model="dateOfBirth">
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                </div>
              </div>

              <day-picker :selectedDate="dateOfBirthForPicker" @update:selectedDate="dateOfBirthForPicker=$event"/>

              <div class="field">
                <button class="button is-success" @click.prevent="onUpdate" :disabled="!selected">
                  Update
                </button>
              </div>      
            </form>
          </div>                                             
        </div>        
      </div>      
    </div>
  </section>
</template>

<script lang="ts">
import { ClickOutside } from '@/directive';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { StoreType } from '@/store/types';
import { Example } from '@/store/example/types';
import DayPicker from '@/components/DayPicker.vue';
import { BindProp, BindSelected } from '@/decorator/Bindable';
import moment from 'moment';

@Component({
  components: { DayPicker }
})
export default class Three extends Vue {

  private selectedDate = moment(); // default to today

  @State(state => state[StoreType.ExampleStore].models)
  models!:Example;

  @BindSelected(StoreType.ExampleStore.toString())
  selected!:Example;

  @BindProp(StoreType.ExampleStore.toString())
  private name!: string;

  @BindProp(StoreType.ExampleStore.toString())
  private shortName!: string;

  @BindProp(StoreType.ExampleStore.toString(), {
    getFormatter: (moment: moment.Moment) => {
      return moment && moment.format('MM-DD-YYYY');
    },
    setFormatter: (value: string) => {
      const newMoment = moment(value, ['MM-DD-YYYY'], true);
      if(newMoment.isValid()){
        return {value: newMoment};
      }
      else {
        return {cancelSetter: true};
      }
    }
  })
  private dateOfBirth!: string;

  @BindProp(StoreType.ExampleStore.toString(), {propName: 'dateOfBirth'})
  private dateOfBirthForPicker!: moment.Moment;

  private onUpdate(){
    this.$store.dispatch(`${StoreType.ExampleStore}/save`);
  }


}
</script>

<style lang="scss">

</style>