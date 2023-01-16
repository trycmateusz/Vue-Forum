import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ThreadShow from '@/views/ThreadShow.vue'
import ThreadCreate from '@/views/ThreadCreate.vue'
import ThreadEdit from '@/views/ThreadEdit.vue'
import Forum from '@/views/Forum.vue'
import Category from '@/views/Category.vue'
import Profile from '@/views/Profile.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{
		path: '/thread/:id',
		name: 'ThreadShow',
		component: ThreadShow,
		props: true,
		// beforeEnter(to, from) {
    //   const dataStore = useDataStore()
		// 	const threadExists = dataStore.threads.find(
		// 		thread => thread.id === to.params.id
		// 	)
		// 	if (!threadExists)
		// 		return {
		// 			name: 'NotFound',
		// 			params: {
		// 				pathMatch: to.path.substring(1).split('/'),
		// 			},
		// 			query: to.query,
		// 			hash: to.hash,
		// 		}
		// },
	},
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true,
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
  },
	{
		path: '/forum/:id',
		name: 'Forum',
		component: Forum,
		props: true,
	},
	{
		path: '/category/:id',
		name: 'Category',
		component: Category,
		props: true,
	},
	{
		path: '/me',
		name: 'Profile',
		component: Profile,
		meta: {
			toTop: true,
			smoothScroll: true,
		},
	},
	{
		path: '/me/edit',
		name: 'ProfileEdit',
		component: Profile,
		props: {
			edit: true,
		},
	},
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to){
		const scroll = {}
		if(to.meta.toTop) scroll.top = 0
		if(to.meta.smoothScroll) scroll.behavior = 'smooth'
		return scroll
	}
})

export default router
