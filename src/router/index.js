import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from "../components/Home";
import Login from "../components/Login";
Vue.use(Router)
Vue.use(ElementUI)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
