import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources } from '@/services/firestoreCalls.js'

export const useForumStore = defineStore('ForumStore', {
	state: () => {
		return {
      forums: [],
		}
	},
	getters: {},
  actions: {
    async fetchForum(resourceId, parent){
      await fetchResource('forums', resourceId, parent, useForumStore())
      return
    },
    async fetchForums(ids, parent){
      await fetchResources('forums', ids, parent, useForumStore())
    },
  }
})
