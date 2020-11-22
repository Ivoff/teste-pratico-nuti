import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue';
import './plugins/bootstrap-vue'
import App from './App.vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Flight from './components/flight/Flight.vue';
import Plane from './components/plane/Plane.vue';
import City from './components/city/City.vue';

require('dotenv').config()

Vue.use(Router);
Vue.config.productionTip = false

const routes = [
  {path: '/', component: Home},
  {path: '/flight', component: Flight},
  // {path: '/flight/create', component: Flight},
  // {path: '/flight/update', component: Flight},    
  {path: '/plane', component: Plane},
  // {path: '/plane/create', component: Plane},
  // {path: '/plane/update', component: Plane},
  {path: '/city', component: City},
  // {path: '/city/create', component: City},
  // {path: '/city/update', component: City}  
]

const router = new Router({
  routes: routes,
  mode: 'history'
});

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
