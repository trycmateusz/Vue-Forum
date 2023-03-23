import { createRouter, createWebHistory } from 'vue-router'
import { findById } from '@/helpers'
import Home from '@/views/Home.vue'
import Category from '@/views/Category.vue'
import Forum from '@/views/Forum.vue'
import ThreadShow from '@/views/ThreadShow.vue'
import ThreadCreate from '@/views/ThreadCreate.vue'
import ThreadEdit from '@/views/ThreadEdit.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import SignIn from '@/views/SignIn.vue'
import NotFound from '@/views/NotFound.vue'
import { useAuthStore } from '@/stores/AuthStore.js'
import { useCategoryStore } from '@/stores/CategoryStore.js'
import { useForumStore } from '@/stores/ForumStore.js'
import { useThreadStore } from '@/stores/ThreadStore.js'
import { usePostStore } from '@/stores/PostStore.js'
import { useUserStore } from '../stores/UserStore'

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{
		path: '/thread/:id',
		name: 'ThreadShow',
		component: ThreadShow,
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
    component: ThreadCreate,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
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
      requiresAuth: true
		},
	},
	{
		path: '/me/edit',
		name: 'ProfileEdit',
		component: Profile,
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
    component: Register,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
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
