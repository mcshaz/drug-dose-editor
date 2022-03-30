import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import AllBolusDrugs from '@/views/AllBolusDrugs.vue'
import EditBolusRows from '@/views/EditBolusRows.vue'
import NotFound from '@/views/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: AllBolusDrugs
  },
  {
    path: '/edit-bolus/:id',
    name: 'editBolusRows',
    component: EditBolusRows
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
