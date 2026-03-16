import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import UserView from '../views/UserView.vue'
import WellnessHomePreview from '../views/WellnessHomePreview.vue'

const routes = [
  {
    path: '/',
    redirect: '/wellness-flow/1'
  },
  {
    path: '/wellness-flow/:step(\\d+)',
    name: 'WellnessFlowStep',
    component: WellnessHomePreview
  },
  {
    path: '/legacy-user',
    name: 'User',
    component: UserView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView
  },
  {
    path: '/wellness-preview',
    redirect: '/wellness-flow/1'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router











