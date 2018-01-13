/**
 *  引入框架
 */
import Vue from 'vue'
import store from './store'
import iview from 'iview'
/**
 *  引入根组件
 */
import App from './App'
import router from './router'
Vue.use(iview);
/**
 *  start
 */
new Vue({
	el: '#mountRoot',
	store,
	router,
	components: { App }
})
