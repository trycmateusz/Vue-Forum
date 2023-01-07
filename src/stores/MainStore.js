import { defineStore } from 'pinia'
import {findById, upsert, appendChildToParent} from '@/helpers'
import firebase from 'firebase/compat/app'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useForumStore } from '@/stores/ForumStore'
import { useThreadStore } from '@/stores/ThreadStore'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'

export const useMainStore = defineStore('MainStore', {
	state: () => {},
  getters: {},
	actions: {
    async getDocSnapshot(resource, resourceId) {
      const docRef = doc(firebase.firestore(), resource, resourceId)
      const docSnap = await getDoc(docRef)
      return {data: docSnap.data(), id: docSnap.id}
    },
    async fetchResource(collection, resourceId, parent, store){
      const { data, id } = await this.getDocSnapshot(collection, resourceId)
      this.setResource(collection, {...data, id}, parent, store)
    },
    async fetchResources(collection, ids, parent, store){
      return Promise.all(ids.map(id => this.fetchResource(collection, id, parent, store)))
    },
    setResource(collection, resource, parent, store){
      upsert(store[collection], resource, parent, collection)
      if(collection === 'posts') {
        if(parent.posts.length !== 1) appendChildToParent(parent, 'contributors', resource.userId)
      }
    },
	},
})
