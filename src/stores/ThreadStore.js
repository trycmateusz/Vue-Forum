import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { useMainStore } from '@/stores/MainStore'
import { useForumStore } from '@/stores/ForumStore'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'

export const useThreadStore = defineStore('ThreadStore', {
	state: () => {
		return {
      threads: [],
		}
	},
	getters: {
    getThread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        if(!thread) return {}
        return {
          ...thread,
          get author(){
            return findById(useUserStore().users, thread.userId)
          },
          get repliesCount(){
            return thread.posts.length - 1
          },
          get contributorsCount(){
            thread.contributors = thread.contributors || []
            return thread.contributors.length
          }
        }
      }
     
    }
  },
  actions: {
    async fetchThread(resourceId, parent){
      await useMainStore().fetchResource('threads', resourceId, parent, useThreadStore())
    },
    async fetchThreads(ids, parent){
      await useMainStore().fetchResources('threads', ids, parent, useThreadStore())
    },
    createThread(text, title, forumId) {
			const publishedAt = Math.floor(Date.now() / 1000)
			const id = `gggg${Math.random()}`
			const userId = useUserStore().authUser.id || ''
			const thread = { forumId, title, publishedAt, userId, id }
      const forum = findById(useForumStore().forums, thread.forumId)
			useMainStore().setResource('threads', thread, forum, useThreadStore())
			const post = {
				text,
				threadId: thread.id,
			}
			usePostStore().createPost(post, thread)
      return findById(this.threads, id)
		},
    updateThread(text, title, threadId){
      const thread = findById(this.threads, threadId)
      const post = findById(usePostStore().posts, thread.posts[0])
      thread.title = title
      post.text = text
      return thread
    },
  }
})
