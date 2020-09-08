import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from "../components/Home";
import Login from "../components/Login";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Category from "../components/power/Category";
import Params from "../components/power/Params";

Vue.use(Router)
Vue.use(ElementUI)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: '/Welcome',
      children: [
        {path: '/Welcome', component: Welcome},
        {path: '/user', component: Users},
        {path: '/right', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/category', component: Category},
        {path: '/params',component:Params}
      ]
    }
  ]
})
//
// //挂载路由导航守卫
// router.beforeEac((to,from,next)=>{
//   //将要访问的路径
//   //form从哪个路径跳转而来
//   //next 是一个函数，表示放行
//      //next()放行 next('/login')强制跳转
//   if (to.path==='/login') return next();
//   //获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })


