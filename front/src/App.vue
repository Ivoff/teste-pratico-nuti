<template>
  <div id="app">    
    <custom-nav-bar :m_routes="routes"></custom-nav-bar>    
    <avioes-do-forro v-if="$route.path === '/'"></avioes-do-forro>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import AvioesDoForro from './components/AvioesDoForro.vue'
import CustomNavBar from './components/CustomNavBar.vue'

export default {  
  name: 'App',
  components: {
    CustomNavBar,
    AvioesDoForro
  },
  data() {
    return {
      routes:[]      
    }    
  },
  created() {        
    this.$router.options.routes.forEach(route => {      
        this.routes.push({
            name: route.component.name, 
            path: route.path
        })
    })
  }
}
</script>

<style>
  html, body {
    height: 100%;        
  }
  #app {        
    font-family: Avenir, Helvetica, Arial, sans-serif;                
    height: 100% !important;
  }
</style>
