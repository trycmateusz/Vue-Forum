import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { useMainStore } from '@/stores/MainStore'
import { useUserStore } from '@/stores/UserStore'

export const usePostStore = defineStore('PostStore', {
	state: () => {
		return {
      posts: [],
		}
	},
	getters: {},
  actions: {
    async fetchPost(resourceId, parent){
      await useMainStore().fetchResource('posts', resourceId, parent, usePostStore())
    },
    async fetchPosts(ids, parent){
      await useMainStore().fetchResources('posts', ids, parent, usePostStore())
    },
    createPost(post, thread) {
			post.publishedAt = Math.floor(Date.now() / 1000)
			post.id = `gggg${Math.random()}`
      const userId = useUserStore().authUser.id
			post.userId = userId
      
			useMainStore().setResource('posts', post, thread, usePostStore())
		},
  }
})
