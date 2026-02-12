import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue')
    },
    {
        path: '/firmalar',
        name: 'firmalar',
        component: () => import('../views/FirmalarView.vue')
    },
    {
        path: '/scraper',
        name: 'scraper',
        component: () => import('../views/ScraperView.vue')
    },
    {
        path: '/hakkinda',
        name: 'hakkinda',
        component: () => import('../views/HakkindaView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
