import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { serverTimestamp } from 'firebase/firestore'
import { findById, upsert } from '@/helpers/'
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
      const thread = await fetchResource('threads', resourceId)
      await upsert(this.threads, thread, parent, 'threads')
      // this.watchThread(thread)
    },
    async fetchThreads(ids, parent){
      const threads = await fetchResources('threads', ids)
      await threads.forEach(async (thread) => {
        // this.watchThread(thread)
        await upsert(this.threads, thread, parent, 'threads')
      })
    },
    async createThread(text, title, forumId) {
			const publishedAt = serverTimestamp()
			const userId = useUserStore().authUser.id || ''
			const threadData = ref({ text, forumId, title, publishedAt, userId })
      const forum = findById(useForumStore().forums, threadData.value.forumId)
			const newThread = await setResource('threads', threadData.value, forum, useThreadStore())
      await updateDocumentInDatabase('forums', forumId, {threads: newThread.id})
			const post = {
				text,
				threadId: newThread.id,
			}
      await this.fetchThread(newThread.id, forum)
			const postId = await usePostStore().createPost(post, newThread)
      setValuesInDatabase('threads', newThread.id, { firstPostId: postId, lastPostId: postId })
      return newThread
		},
    async updateThread(text, title, threadId){
      console.log(text, title, threadId)
      const thread = findById(this.threads, threadId)
      const post = findById(usePostStore().posts, thread.posts[0])
      await setValuesInDatabase('threads', thread.id, { title })
      await setValuesInDatabase('posts', post.id, { text })
      return thread
    },
    // watchThread(thread){
    //   if(thread.posts & thread.contributors) {
    //     // watch(thread.posts, usePostStore().fetchPost(thread.lastPostId, thread))
    //     const contributorIndex = thread.contributors.length - 1
    //     // watch(thread.contributors, useUserStore().fetchUser(thread.contributors[contributorIndex]))
    //     watchEffect(async() => {
    //       await usePostStore().fetchPost(thread.lastPostId, thread)
    //     })
    //     watchEffect(async() => {
    //       await useUserStore().fetchUser(thread.contributors[contributorIndex]) 
    //     })
    //   }
    // },
  }
})
