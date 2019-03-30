import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/css/index.css';
Vue.use(Tooltip);

import vueScrollTo from 'vue-scroll-to';
// var options = {
//   speed: 1000,
// }
Vue.use(vueScrollTo);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
