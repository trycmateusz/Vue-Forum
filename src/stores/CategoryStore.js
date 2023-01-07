import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { collection, getDocs } from 'firebase/firestore'
import { findById } from '@/helpers/'
import { useMainStore } from '@/stores/MainStore'

export const useCategoryStore = defineStore('CategoryStore', {
	state: () => {
		return {
      categories: [],
		}
	},
	getters: {},
  actions: {
    async fetchCategory(resourceId){
      await useMainStore().fetchResource('categories', resourceId, {}, useCategoryStore())
    },
    async fetchCategories(ids){
      await useMainStore().fetchResources('categories', ids, {}, useCategoryStore())
    },
    async fetchAllCategories(){
      const querySnapshot = await getDocs(collection(firebase.firestore(), 'categories'))
      querySnapshot.forEach(doc => {
        const category = {...doc.data(), id: doc.id}
        useMainStore().setResource('categories', category, {}, useCategoryStore())
      })
    },
  }
})
