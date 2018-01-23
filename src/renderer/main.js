import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(iView)
new Vue({
    el: '#mountRoot',
    store,
    router,
    components: { App }
})
