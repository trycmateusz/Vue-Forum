import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { useMainStore } from '@/stores/MainStore'

export const useForumStore = defineStore('ForumStore', {
	state: () => {
		return {
      forums: [],
		}
	},
	getters: {},
  actions: {
    async fetchForum(resourceId, parent){
      await useMainStore().fetchResource('forums', resourceId, parent, useForumStore())
    },
    async fetchForums(ids, parent){
      await useMainStore().fetchResources('forums', ids, parent, useForumStore())
    },
  }
})
