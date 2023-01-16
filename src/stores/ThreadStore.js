import { ref } from 'vue'
import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { serverTimestamp } from 'firebase/firestore'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources, setResource, updateDocumentInDatabase, setValuesInDatabase } from '@/services/firestoreCalls.js'
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
      await fetchResource('threads', resourceId, parent, useThreadStore())
    },
    async fetchThreads(ids, parent){
      await fetchResources('threads', ids, parent, useThreadStore())
    },
    async createThread(text, title, forumId) {
			const publishedAt = serverTimestamp()
			const userId = useUserStore().authUser.id || ''
			const thread = ref({ text, forumId, title, publishedAt, userId })
      const forum = findById(useForumStore().forums, thread.value.forumId)
			const id = await setResource('threads', thread.value, forum, useThreadStore())
      await updateDocumentInDatabase('forums', forumId, {threads: id})
			const post = {
				text,
				threadId: id,
			}
      await this.fetchThread(id, forum)
      thread.value = findById(this.threads, id)
			const postId = await usePostStore().createPost(post, thread.value)
      setValuesInDatabase('threads', id, { firstPostId: postId })
      return thread.value
		},
    async updateThread(text, title, threadId){
      const thread = findById(this.threads, threadId)
      const post = findById(usePostStore().posts, thread.posts[0])
      await setValuesInDatabase('threads', thread.id, { title })
      await setValuesInDatabase('posts', post.id, { text })
      return thread
    },
  }
})
