import { defineStore } from 'pinia'
import { onAuthStateChanged, getAuth, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useUserStore } from '@/stores/UserStore'

export const useAuthStore = defineStore('AuthStore', {
	state: () => {
		return {
      unsubscribes: [],
      authUserUnsubscribe: null,
      authObserverUnsubscribe: null
		}
	},
	getters: {},
  actions: {
    initAuthentication(){
      if(this.authObserverUnsubscribe) this.authObserverUnsubscribe()
      return new Promise(res => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          this.unsubscribeAuthUserSnapshot()
          if(user){
            await useUserStore().fetchAuthUser()
            res(user)
          } else {
            res(null)
          }
        })
        this.setAuthObserverUnsubscribe(unsubscribe)
      })

    },
    appendUnsubscribe(unsub){
      this.unsubscribes.push(unsub)
    },
    clearAllUnsubscribes(){
      this.unsubscribes = []
    },
    unsubscribeAllSnapshots(){
      this.unsubscribes.forEach(unsubscribe => unsubscribe.unsub())
      this.clearAllUnsubscribes()
    },
    setAuthUserUnsubscribe(unsubscribe){
      this.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe(unsubscribe){
      this.authObserverUnsubscribe = unsubscribe
    },
    async unsubscribeAuthUserSnapshot(){
      if(this.authUserUnsubscribe){
        this.authUserUnsubscribe = null
        this.setAuthUserUnsubscribe(null)
      }
    },
    async reauthenticateUser(email, password){
      const auth = getAuth()
      const user = auth.currentUser
      const credential = await EmailAuthProvider.credential(email, password)
      await reauthenticateWithCredential(user, credential)
    },
    async updateEmailInFirebase(email){
      const auth = getAuth()
      const user = auth.currentUser
      updateEmail(user, email)
    },
    async updatePasswordInFirebase(password){
      const auth = getAuth()
      const user = auth.currentUser
      updatePassword(user, password)
    }
  }
})
