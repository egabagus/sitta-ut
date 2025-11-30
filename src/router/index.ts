import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Stock',
        component: () => import('../pages/Stock.vue')
    },
    {
        path: '/tracking',
        name: 'Tracking',
        component: () => import('../pages/Tracking.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;