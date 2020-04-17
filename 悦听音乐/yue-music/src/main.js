import Vue from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import NProgress from 'nprogress'
import axios from 'axios'
import Aplayer from '@moefe/vue-aplayer'

Vue.use(Aplayer, {
  defaultCover: '',
  productionTip: true,
})
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
axios.defaults.baseURL = 'https://autumnfish.cn/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
