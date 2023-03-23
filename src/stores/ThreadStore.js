import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { serverTimestamp, writeBatch, doc, arrayUnion } from 'firebase/firestore'
import chunk from 'lodash/chunk'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources, setResource } from '@/services/firestoreCalls.js'
import { useAuthStore } from '@/stores/AuthStore'
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
        if(!thread) return null
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
    clearThreads(){
      this.threads = []
    },
    async fetchThread(resourceId, handleOnSnapshot = null){
      await fetchResource('threads', resourceId, this, null, handleOnSnapshot)
    },
    async fetchThreads(ids){
      return await fetchResources('threads', ids, this)
    },
    async fetchThreadsByPage(ids, page, perPage = 10){
      this.threads = []
      useAuthStore().unsubscribeAllSnapshots()
      const chunks = chunk(ids, perPage)
      const idsForPage = chunks[page - 1]
      return await this.fetchThreads(idsForPage)
    },
    async createThread(text, title, forumId) {
			const publishedAt = serverTimestamp()
			const userId = useUserStore().authUser.id || ''
			const threadData = { text, forumId, title, publishedAt, userId }
			const newThread = await setResource('threads', threadData, this)
      const post = {
				text,
				threadId: newThread.id,
			}
			const postId = await usePostStore().createPost(post, newThread)
      const forumRef = doc(firebase.firestore(), 'forums', forumId)
      const userRef = doc(firebase.firestore(), 'users', userId)
      const threadRef = doc(firebase.firestore(), 'threads', newThread.id)
      const batch = writeBatch(firebase.firestore())
        batch.update(forumRef, { threads: arrayUnion(newThread.id)})
        batch.update(userRef, { threads: arrayUnion(newThread.id)})
        batch.update(threadRef, { firstPostId: postId, lastPostId: postId })
      await batch.commit()
      return newThread
		},
    async updateThread(text, title, threadId){
      const thread = findById(this.threads, threadId)
      const post = findById(usePostStore().posts, thread.posts[0])
      const threadRef = doc(firebase.firestore(), 'threads', thread.id)
      const postRef = doc(firebase.firestore(), 'posts', post.id)
      const batch = writeBatch(firebase.firestore())
        batch.update(threadRef, { title })
        batch.update(postRef, { text })
      await batch.commit()
      return thread
    },
  }
})
