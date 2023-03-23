import { defineStore } from 'pinia'
import { upsert } from '@/helpers'
import firebase from 'firebase/compat/app'
import { collection, getDocs } from 'firebase/firestore'
import { fetchResource, fetchResources } from '@/services/firestoreCalls.js'

export const useCategoryStore = defineStore('CategoryStore', {
	state: () => {
		return {
      categories: [],
		}
	},
	getters: {},
  actions: {
    clearCategories(){
      this.categories = []
    },
    async fetchCategory(resourceId){
      await fetchResource('categories', resourceId, this)
    },
    async fetchCategories(ids){
      await fetchResources('categories', ids, this)
    },
    async fetchAllCategories(){
      const querySnapshot = await getDocs(collection(firebase.firestore(), 'categories'))
      querySnapshot.forEach(doc => {
        const category = {...doc.data(), id: doc.id}
        upsert(this.categories, category)
      })
    },
  }
})
