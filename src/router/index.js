import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
{
	path: '/',
	name: 'ProductPage',
	component: () => import('../views/ProductPage.vue')
}
]

const router = new VueRouter({
routes
})

export default router
