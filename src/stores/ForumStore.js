import { defineStore } from 'pinia'
import { upsert } from '@/helpers'
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
      const forum = await fetchResource('forums', resourceId)
      upsert(this.forums, forum, parent, 'forums')
    },
    async fetchForums(ids, parent){
      const forums = await fetchResources('forums', ids)
      await forums.forEach(forum => {
        upsert(this.forums, forum, parent, 'forums')
      })
    },
  }
})
