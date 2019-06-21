<template>
  <section class="hero is-primary is-fullheightz">
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
              <div class="field control has-icons-left">              
                <input ref="dateTextBox" class="tooltip-target input" placeholder="M-D-YYYY" v-model="selectedDateForTextbox" @focus="isSelectorShown=true">              
                <span class="icon is-small is-left">
                  <i class="fa fa-calendar"></i>
                </span>
                {{isSelectorShown}}
                <modal name="dateSelectorModal" @before-open="onBeforeDialogOpened" height="auto" width="300px" :pivotX="thePivotX" :pivotY="thePivotY">
                  <v-day-selector ref="dateSelector" v-model="selectedDateForSelector" single-month />
                </modal>
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
export default class Three extends Vue {
  
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

  @Watch('isSelectorShown')
  private onIsSelectorShownChanged(){
    if(this.isSelectorShown){
      this.$modal.show('dateSelectorModal');
    }
    else {
      this.$modal.hide('dateSelectorModal');
    }
  }

  private onBeforeDialogOpened(){
    // compute where the inputTextBox is on the screen
    //const dateSelectorRect: any = (<any>this.$refs['dateSelector']).getBoundingClientRect();
    const dateTextBoxRect: any = (<any>this.$refs['dateTextBox']).getBoundingClientRect();
    
    //this.thePivotX = (boundingRect.x + boundingRect.width)/ window.innerWidth;
    //this.thePivotY = (boundingRect.bottom + 300) / window.innerHeight;
    
    this.thePivotY = (dateTextBoxRect.bottom + (288/2)) / window.innerHeight;
    this.thePivotX = (dateTextBoxRect.left) / window.innerWidth;

    debugger;
  }

  private thePivotX = .5;
  private thePivotY = .5;
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