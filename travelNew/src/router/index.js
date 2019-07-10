import Vue from 'vue'
import Router from 'vue-router'
import header from '@/components/header/header'
import flight from '@/components/flight/flight'


Vue.use(Router)
let routers=new Router({
  routes: [
    {
      path: '/header',
      name: 'header',
      component: header,
      children: [
        {
          path: '/flight',
          name: 'flight',
          component: flight
        }
      ]
    }
  ]
})
routers.push('flight')
export default routers;
