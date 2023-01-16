import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { serverTimestamp, doc, collection, increment } from 'firebase/firestore'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources, setResource, updateDocumentInDatabase, setValuesInDatabase } from '@/services/firestoreCalls.js'
import { setResourceInStore, setValuesInStore } from '@/services/storeCalls.js'
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
      await fetchResource('posts', resourceId, parent, usePostStore())
    },
    async fetchPosts(ids, parent){
      await fetchResources('posts', ids, parent, usePostStore())
    },
    async createPost(post, thread) {
      post.userId = useUserStore().authUser.id
			post.publishedAt = serverTimestamp()
      const postId = await setResource('posts', post, thread, usePostStore())
      const checkForContributors = () => {
        if(thread.posts){
          if(thread.posts.length > 1){
            setResourceInStore('contributors', post.userId, thread, [])
            return { posts: postId, contributors: post.userId }
          }
          return { posts: postId }
        }
        return { posts: postId }
      }
      const dataToUpdateInThread = checkForContributors()
      await setValuesInDatabase('users', post.userId, { postsCount: increment(1) })
      await updateDocumentInDatabase('threads', thread.id, dataToUpdateInThread)
      return postId
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
      const updatedPost = await setValuesInDatabase('posts', id, {...post})
    }
  }
})