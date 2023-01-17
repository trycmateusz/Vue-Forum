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
    async fetchCategory(resourceId){
      const category = await fetchResource('categories', resourceId)
      upsert(this.categories, category)
    },
    async fetchCategories(ids){
      const categories = await fetchResources('categories', ids)
      categories.forEach(category => {
        upsert(this.categories, category)
      })
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
