import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Entreprise from '../views/Entreprise.vue'
import Actifs from '../views/Actifs.vue'
import Vulnerabilites from '../views/Vulnerabilites.vue'
import Dashboard from '../views/Dashboard.vue'
import Rapport from '../views/Rapport.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Accueil',
      component: Accueil
    },
    {
      path: '/entreprise',
      name: 'Entreprise',
      component: Entreprise
    },
    {
      path: '/actifs',
      name: 'Actifs',
      component: Actifs
    },
    {
      path: '/vulnerabilites',
      name: 'Vulnerabilites',
      component: Vulnerabilites
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/rapport',
      name: 'Rapport',
      component: Rapport
    }
  ]
})

export default router
