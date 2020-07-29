import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from "../components/Home";
Vue.use(Router)
Vue.use(ElementUI)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
