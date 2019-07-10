<template>
  <div id="app" @mousemove="onMouseMove">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/one">One</router-link> |
      <router-link to="/two">Two</router-link> |
      <router-link to="/three">Three</router-link> |
      <router-link to="/four">Four</router-link> | 
      <router-link to="/five">Five</router-link> |
      <router-link to="/six">Six</router-link> |
      <router-link to="/seven">Seven</router-link> 
    </div>
    <router-view/>
    <p> x: {{x}}, y: {{y}}
    <div style="width:900px;background-color:red">Yo</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {

  private x = null;
  private y = null;
  private onMouseMove(event: any){
    this.x = event.clientX;
    this.y = event.clientX;
  }
}
</script>

<style lang="scss">
@import "../node_modules/font-awesome/css/font-awesome.min.css";
@import "styles/main";



#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} 

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
