import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt') === null) {
          next('/login')
          return
        }

        next()
      }
    },
    {
      path: '/patients/:id?',
      name: 'patients',
      props: (route) => {
        if (!route.params.id) {
          return
        }

        return {
          patient: route.params.id
        }
      },
      component: () => import('../views/PatientView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt') === null) {
          next('/login')
          return
        }

        next()
      }
    },
    {
      path: '/records',
      name: 'records',
      component: () => import('../views/ManagePatientsView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt') === null) {
          next('/login')
          return
        }

        next()
      }
    },
    {
      path: '/chats',
      name: 'chats',
      component: () => import('../views/ChatView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt') === null) {
          next('/login')
          return
        }

        next()
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt')) {
          next('/')
          return
        }

        next()
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt')) {
          next('/')
          return
        }

        next()
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactNumView.vue'),
      beforeEnter: (to, from, next) => {
        const $cookies = inject<VueCookies>('$cookies') as VueCookies
        if ($cookies.get('jwt') === null) {
          next('/login')
          return
        }

        next()
      }
    }
  ]
})

export default router
