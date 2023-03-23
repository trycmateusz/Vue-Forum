import { defineStore } from 'pinia'
import { fetchResource, fetchResources } from '@/services/firestoreCalls.js'

export const useForumStore = defineStore('ForumStore', {
	state: () => {
		return {
      forums: [],
		}
	},
	getters: {},
  actions: {
    clearForums(){
      this.forums = []
    },
    async fetchForum(resourceId){
      await fetchResource('forums', resourceId, this)
    },
    async fetchForums(ids){
      await fetchResources('forums', ids, this)
    },
  }
})
