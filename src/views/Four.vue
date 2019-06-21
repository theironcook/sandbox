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

              <div class="field date-selector-container" v-click-outside="onClickOutsideDateSelector">                
                <div class="control has-icons-left">              
                  <input class="input" @keyup.esc="onInputEscape" placeholder="M-D-YYYY" v-model="selectedDateForTextbox" @focus="isSelectorShown=true">              
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>                  
                </div>              
                <v-day-selector class="date-selector" v-show="isSelectorShown" v-model="selectedDateForSelector" single-month />                
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
import VDaySelector from 'vuelendar/components/vl-day-selector.vue';
import moment from 'moment';

@Component({
  components: { VDaySelector },
  directives: { ClickOutside }
})
export default class Three extends Vue {
  
  private readonly SELECTOR_DATE_FORMAT = 'YYYY-MM-DD';  
  private readonly TEXTBOX_DATE_FORMAT = 'M-D-YYYY';
  private readonly ACCEPTED_TEXTBOX_DATE_FORMATS = [this.TEXTBOX_DATE_FORMAT, 'MM-DD-YYYY', 'M/D/YYYY', 'MM/DD/YYYY'];
  
  private isSelectorShown = true;
  private selectedDate = moment(); // default to today

  private get selectedDateForSelector(){
    return this.selectedDate.format(this.SELECTOR_DATE_FORMAT);
  }

  private set selectedDateForSelector(val){    
    this.selectedDate = moment(val);    
    this.isSelectorShown = false;
  }

  private get selectedDateForTextbox(): string{
    return this.selectedDate.format(this.TEXTBOX_DATE_FORMAT);
  }

  private set selectedDateForTextbox(val: string){
    const newMoment = moment(val, this.ACCEPTED_TEXTBOX_DATE_FORMATS, true);
    if(newMoment.isValid()){
      this.selectedDate = newMoment;      
    }
  }

  private onClickOutsideDateSelector(){
    this.isSelectorShown = false;
  }

  private onInputEscape(){
    this.isSelectorShown = false;
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

.date-selector-container {
  position: relative;
}

.date-selector {
  position: absolute;
  left: 0px;  
  z-index: 1;
}

</style>