<template>
  <div class="field day-selector-container" v-click-outside="onClickOutsideDateSelector">                
    <div class="control has-icons-left">              
      <input class="input" @keyup.esc="onInputEscape" placeholder="M-D-YYYY" v-model="dateForTextbox" @focus="isSelectorVisible=true">              
      <span class="icon is-small is-left">
        <i class="fa fa-calendar"></i>
      </span>                  
    </div>
    <v-day-selector class="day-selector" v-show="isSelectorVisible" v-model="dateForSelector" single-month />                
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import { ClickOutside } from '@/directive';
import VDaySelector from 'vuelendar/components/vl-day-selector.vue';

@Component({
  components: { VDaySelector },
  directives: { ClickOutside }
})
export default class DayPicker extends Vue {
  
  @Prop() private selectedDate!: moment.Moment;

  private readonly SELECTOR_DATE_FORMAT = 'YYYY-MM-DD';  
  private readonly TEXTBOX_DATE_FORMAT = 'M-D-YYYY';
  private readonly ACCEPTED_TEXTBOX_DATE_FORMATS = [this.TEXTBOX_DATE_FORMAT, 'MM-DD-YYYY', 'M/D/YYYY', 'MM/DD/YYYY'];
  
  private isSelectorVisible = false;
  
  private get dateForSelector(){
    return this.selectedDate.format(this.SELECTOR_DATE_FORMAT);
  }

  private set dateForSelector(val){    
    this.$emit('update:selectedDate', moment(val));
    this.isSelectorVisible = false;
  }

  private get dateForTextbox(): string{
    return this.selectedDate.format(this.TEXTBOX_DATE_FORMAT);
  }

  private set dateForTextbox(val: string){
    const newMoment = moment(val, this.ACCEPTED_TEXTBOX_DATE_FORMATS, true);
    if(newMoment.isValid()){
      this.$emit('update:selectedDate', moment(val));
    }
  }

  private onClickOutsideDateSelector(){
    this.isSelectorVisible = false;
  }

  private onInputEscape(){
    this.isSelectorVisible = false;
  }
}
</script>
<style scoped lang="scss">
@import "../styles/main";

// update vuelendar with the bulma color scheme
//$vl-primary: $text;

@import '../../node_modules/vuelendar/scss/vuelendar';

// Make the popup calendar have a rounded border via the bulma specs
.vl-calendar {
  border-radius: $radius;
} 

.day-selector-container {
  position: relative;
}

.day-selector {
  position: absolute;
  left: 0px;  
  z-index: 1;
}

</style>
