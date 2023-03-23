import { createRouter, createWebHistory } from 'vue-router'
import { findById } from '@/helpers'
import { useAuthStore } from '@/stores/AuthStore.js'
import { useCategoryStore } from '@/stores/CategoryStore.js'
import { useForumStore } from '@/stores/ForumStore.js'
import { useThreadStore } from '@/stores/ThreadStore.js'
import { usePostStore } from '@/stores/PostStore.js'
import { useUserStore } from '../stores/UserStore'

const routes = [
	{ 
    path: '/', 
    name: 'Home', 
    component: () => import(/*webpackChunkName: "Home"*/'@/views/Home.vue') 
  },
	{
		path: '/thread/:id',
		name: 'ThreadShow',
		component: () => import(/*webpackChunkName: "ThreadShow"*/'@/views/ThreadShow.vue'),
		props: true,
		async beforeEnter(to) {
      const authStore = useAuthStore()
      const threadStore = useThreadStore()
      await threadStore.fetchThread(to.params.id)
			const threadExists = findById(threadStore.threads, to.params.id)
			if (!threadExists)
				return {
					name: 'NotFound',
					params: {
						pathMatch: to.path.substring(1).split('/'),
					},
					query: to.query,
					hash: to.hash,
				}
      threadStore.threads = []
      authStore.unsubscribeAllSnapshots()
		},
	},
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import(/*webpackChunkName: "ThreadCreate"*/'@/views/ThreadCreate.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/*webpackChunkName: "ThreadEdit"*/'@/views/ThreadEdit.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
	{
		path: '/forum/:id',
		name: 'Forum',
		component: () => import(/*webpackChunkName: "Forum"*/'@/views/Forum.vue'),
		props: true,
	},
	{
		path: '/category/:id',
		name: 'Category',
		component: () => import(/*webpackChunkName: "Category"*/'@/views/Category.vue'),
		props: true,
	},
	{
		path: '/me',
		name: 'Profile',
		component: () => import(/*webpackChunkName: "Profile"*/'@/views/Profile.vue'),
		meta: {
			toTop: true,
			smoothScroll: true,
      requiresAuth: true
		},
	},
	{
		path: '/me/edit',
		name: 'ProfileEdit',
		component: () => import(/*webpackChunkName: "ProfileEdit"*/'@/views/Profile.vue'),
		props: {
			edit: true,
      meta: {
        requiresAuth: true
      }
		},
	},
  {
    path: '/register',
    name: 'Register',
    component: () => import(/*webpackChunkName: "Register"*/'@/views/Register.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/*webpackChunkName: "SignIn"*/'@/views/SignIn.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter(){
      await useUserStore().signOut()
      return { name: 'Home' }
    }
  },
	{ 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import(/*webpackChunkName: "NotFound"*/'@/views/NotFound.vue') 
  },
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
router.beforeEach(async (to) => {
  await useAuthStore().initAuthentication()
  useAuthStore().unsubscribeAllSnapshots()
  if(to.meta.requiresAuth && !useUserStore().authId){
    return { 
      name: 'SignIn',
      query: { redirectTo: to.path}
    }
  }
  if(to.meta.requiresGuest && useUserStore().authId){
    return { name: 'Home' }
  }
})
router.afterEach((to, from) => {
  if(to.path != from.path){
    useCategoryStore().clearCategories()
    useForumStore().clearForums()
    useThreadStore().clearThreads()
    usePostStore().clearPosts()
  }
})
export default router
