<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      Yo dawg
      <div class="container">
        <div class="columns is-centered">
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
            </form>
          </div>          
        </div>
        <div class="column">          
          <v-popover offset="16" placement="auto-end" trigger="manual" :open="isSelectorShown" :auto-hide="false" >
            <div class="field control has-icons-left">              
              <input @focus="onSelectedDateTextboxOnFocus($event)" @blur="onSelectedDateTextboxBlur" class="tooltip-target input" placeholder="M-D-YYYY" v-model="selectedDateForTextbox">              
              <span class="icon is-small is-left">
                <i class="fa fa-calendar"></i>
              </span>
              {{isSelectorShown}} 
            </div>
            <template slot="popover">
              <v-day-selector @blur="onDateSelectorBlur" @click="onClickedPicker" v-model="selectedDateForSelector" single-month />
            </template>
          </v-popover>
        </div>    
      </div>      
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import VDaySelector from 'vuelendar/components/vl-day-selector.vue';
import moment from 'moment';

@Component({
  components: {VDaySelector}
})
export default class One extends Vue {
  
  private readonly SELECTOR_DATE_FORMAT = 'YYYY-MM-DD';
  private readonly TEXTBOX_DATE_FORMAT = 'M-D-YYYY';
  
  private isSelectorShown = false;
  private selectedDate = moment(); // default to today

  private get selectedDateForSelector(){
    return this.selectedDate.format(this.SELECTOR_DATE_FORMAT);
  }

  private set selectedDateForSelector(val){    
    this.selectedDate = moment(val);
    console.log('selectedDateForSelector ', this.selectedDate);
    this.isSelectorShown = false;
  }

  private get selectedDateForTextbox(): string{
    return this.selectedDate.format(this.TEXTBOX_DATE_FORMAT);
  }

  private set selectedDateForTextbox(val: string){
    const newMoment = moment(val, this.TEXTBOX_DATE_FORMAT, true);
    if(newMoment.isValid()){
      this.selectedDate = newMoment;      
    }
  }

  private onSelectedDateTextboxBlur(event: any){
    //console.log('onSelectedDateTextboxBlur ', event.target);
    //this.isSelectorShown = false;
  }

  private isSelectorShownFunk(){
    console.log('yowww, isSelectorShown ', this.isSelectorShown);
    return this.isSelectorShown;
  }

  private onDateSelectorBlur(event: any){
    console.log('onDateSelectorBlur ', event.target);    
  }

  // mounted(){
  //   window.addEventListener('click', (event) => {
  //     console.log('yoo yo');
  //   }, true)
  // }

  private onClickedPicker(event: any){
    console.log('onClickedPicker ', event);
  }

  private onSelectedDateTextboxOnFocus(event: any){
    console.log('onSelectedDateTextboxOnFocus ', event);
    this.isSelectorShown=true;
  }


}
</script>

<style lang="scss">
@import "../styles/main";

// update vuelendar with the bulma color scheme
$vl-primary: $text;

@import '../../node_modules/vuelendar/scss/vuelendar';

// Make the popup calendar have a rounded border via the bulma specs
.vl-calendar {
  border-radius: $radius;
} 

</style>