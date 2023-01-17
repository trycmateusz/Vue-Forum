import { defineStore } from 'pinia'
import { upsert } from '@/helpers'
import { serverTimestamp, increment } from 'firebase/firestore'
import { fetchResource, fetchResources, setResource, updateDocumentInDatabase, setValuesInDatabase } from '@/services/firestoreCalls.js'
import { useThreadStore } from '@/stores/ThreadStore'
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
      const post = await fetchResource('posts', resourceId)
      upsert(this.posts, post, parent, 'posts')
    },
    async fetchPosts(ids, parent){
      const posts = await fetchResources('posts', ids)
      posts.forEach(post => {
        upsert(this.posts, post, parent, 'posts')
      })
    },
    async createPost(post, thread) {
      post.userId = useUserStore().authUser.id
			post.publishedAt = serverTimestamp()
      const newPost = await setResource('posts', post, thread, usePostStore())
      this.fetchPost(newPost.id,)
      const checkForContributors = () => {
        if(thread.posts){
          if(thread.posts.length > 0 && thread.contributors.indexOf(newPost.userId) == -1){
            return { contributors: newPost.userId }
          }
        }
        return {}
      }
      const dataToUpdateInThread = checkForContributors()
      dataToUpdateInThread.posts = newPost.id
      await setValuesInDatabase('threads', thread.id, { lastPostId: newPost.id })
      await setValuesInDatabase('users', newPost.userId, { postsCount: increment(1) })
      await updateDocumentInDatabase('threads', thread.id, dataToUpdateInThread)
      useThreadStore().fetchThread(thread.id)
      return newPost.id
		},
    async updatePost(text, id){
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: useUserStore().authId,
          moderated: false
        }
      }
      await setValuesInDatabase('posts', id, {...post})
      await this.fetchPost(id)
    }
  }
})