import Vue from 'vue'
import Router from 'vue-router'
import header from '@/components/header/header'
import flight from '@/components/flight/flight'
import hotel from '@/components/hotel/hotel'
import train from '@/components/train/train'

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
        },
        {
          path: '/hotel',
          name: 'hotel',
          component: hotel
        },
        {
          path: '/train',
          name: 'train',
          component: train
        }
      ]
    }
  ]
})
routers.push('flight')
export default routers;
