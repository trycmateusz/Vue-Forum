import { defineStore } from 'pinia'
import { findById } from '@/helpers/'
import { useMainStore } from '@/stores/MainStore'
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
            return this.posts.length
          },
  
          get threads() {
            return useThreadStore().threads.filter(
              thread => thread.userId === user.id
            )
          },
  
          get threadsCount() {
            return this.threads.length
          },
        } 
      }
    },
  },
  actions: {
    async fetchUser(resourceId){
      await useMainStore().fetchResource('users', resourceId, {}, useUserStore())
    },
    async fetchUsers(ids){
      await useMainStore().fetchResources('users', ids, {}, useUserStore())
    },
    updateUser(requestedUser, editedUser) {
			const requestedUserIndex = this.users.findIndex(
				user => user.id === requestedUser.id
			)
			this.users[requestedUserIndex] = { ...editedUser }
		},
  }

})
