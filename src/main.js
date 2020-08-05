// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/globaLcss.less'
import './assets/font/iconfont.css'
import axios from 'axios'

//配置请求根路径

const instance = axios.create()
instance.defaults.baseURL = 'http://127.0.0.1:8089/'
Vue.prototype.$http = instance

Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
