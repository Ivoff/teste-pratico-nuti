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
import vSelect from 'vue-select'
import "vue-select/dist/vue-select.css";

require('dotenv').config()

Vue.use(Router);
Vue.component('v-select', vSelect)
Vue.config.productionTip = false

Object.keys(process.env).forEach((element) => {
	if (element.indexOf('VUE_APP_') != -1) {
		Vue.prototype[`$${element.replace('VUE_APP_', '')}`] = process.env[element];
	}
});

const routes = [
	{path: '/', component: Home},
	{path: '/flight', component: Flight},  
	{path: '/plane', component: Plane},  
	{path: '/city', component: City}  
]

const router = new Router({
	routes: routes,
	mode: 'history'
});

new Vue({
	render: h => h(App),
	router: router
}).$mount('#app')
