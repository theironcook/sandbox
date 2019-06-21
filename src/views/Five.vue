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

              <day-picker :selectedDate="selectedDate" @update:selectedDate="selectedDate=$event"/>
              <br>
              {{selectedDate}}
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
import DayPicker from '@/components/DayPicker.vue';
import moment from 'moment';

@Component({
  components: { DayPicker }
})
export default class Three extends Vue {

  private selectedDate = moment(); // default to today

}
</script>

<style lang="scss">

</style>