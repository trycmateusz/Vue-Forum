import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources } from '@/services/firestoreCalls.js'
import { usePostStore } from '@/stores/PostStore'
import { useThreadStore } from '@/stores/ThreadStore'

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			authId: 'f5xvKdIPQdSrUtT6i3UiHYttRXO2',
      users: [],
		}
	},
	getters: {
		authUser(state){
      return this.user(state.authId)
		},
    user: state => {
      return id => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts() {
            return usePostStore().posts.filter(post => post.userId === user.id)
          },
          get postsCount() {
            return user.postsCount || 0
          },
          get threads() {
            return useThreadStore().threads.filter(
              thread => thread.userId === user.id
            )
          },
          get threadsCount() {
            return user.threads?.length || 0
          },
        } 
      }
    },
  },
  actions: {
    async fetchAuthUser(){
      await fetchResource('users', this.authId, {}, useUserStore())
    },
    async fetchUser(resourceId){
      await fetchResource('users', resourceId, {}, useUserStore())
    },
    async fetchUsers(ids){
      await fetchResources('users', ids, {}, useUserStore())
    },
    updateUser(requestedUser, editedUser) {
			const requestedUserIndex = this.users.findIndex(
				user => user.id === requestedUser.id
			)
			this.users[requestedUserIndex] = { ...editedUser }
		},
  }

})
