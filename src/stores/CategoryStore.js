import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { collection, getDocs } from 'firebase/firestore'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources } from '@/services/firestoreCalls.js'
import { setResourceInStore } from '@/services/storeCalls.js'

export const useCategoryStore = defineStore('CategoryStore', {
	state: () => {
		return {
      categories: [],
		}
	},
	getters: {},
  actions: {
    async fetchCategory(resourceId){
      await fetchResource('categories', resourceId, {}, useCategoryStore())
    },
    async fetchCategories(ids){
      await fetchResources('categories', ids, {}, useCategoryStore())
    },
    async fetchAllCategories(){
      const querySnapshot = await getDocs(collection(firebase.firestore(), 'categories'))
      querySnapshot.forEach(doc => {
        const category = {...doc.data(), id: doc.id}
        setResourceInStore('categories', category, {}, useCategoryStore())
      })
    },
  }
})
