import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { serverTimestamp, increment, doc, writeBatch, updateDoc, arrayUnion } from 'firebase/firestore'
import { fetchResource, fetchResources, setResource, fetchOnConditions } from '@/services/firestoreCalls.js'
import { useUserStore } from '@/stores/UserStore'

export const usePostStore = defineStore('PostStore', {
	state: () => {
		return {
      posts: [],
		}
	},
	getters: {},
  actions: {
    clearPosts(){
      this.posts = []
    },
    async fetchPost(resourceId, handleOnSnapshot = null){
      await fetchResource('posts', resourceId, this, null, handleOnSnapshot)
    },
    async fetchPosts(ids, handleOnSnapshot = null){
      await fetchResources('posts', ids, this, handleOnSnapshot)
    },
    async fetchAuthUsersPosts(startAfter){
      await fetchOnConditions('posts', this, {
        where: ['userId', '==', useUserStore().authId],
        orderBy: ['publishedAt', 'desc'],
        limit: 10,
        startAfter
      })
    },
    async createPost(post, thread) {
      post.userId = useUserStore().authUser.id
			post.publishedAt = serverTimestamp()
      const newPost = await setResource('posts', post, this)
      const checkForContributors = () => {
        if(thread.posts){
          if(thread.posts.length > 0 && thread.contributors.indexOf(newPost.userId) == -1){
            return { contributors: arrayUnion(newPost.userId) }
          }
        }
        return {}
      }
      const toUpdateThread = checkForContributors()
      toUpdateThread.posts = arrayUnion(newPost.id)
      toUpdateThread.lastPostId = newPost.id
      const threadRef = doc(firebase.firestore(), 'threads', thread.id)
      const userRef = doc(firebase.firestore(), 'users', newPost.userId)
      const batch = writeBatch(firebase.firestore())
        batch.update(threadRef, toUpdateThread)
        batch.update(userRef, { postsCount: increment(1) })
      await batch.commit()
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
      const updateRefPost = doc(firebase.firestore(), 'posts', id)
      await updateDoc(updateRefPost, {...post})
    }
  }
})