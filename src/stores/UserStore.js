import { defineStore } from 'pinia'
import firebase from 'firebase/compat/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { findById } from '@/helpers/'
import { fetchResource, fetchResources, setResourceWithId } from '@/services/firestoreCalls.js'
import { useNotifications } from '@/composables/useNotifications.js'
import { usePostStore } from '@/stores/PostStore'
import { useThreadStore } from '@/stores/ThreadStore'
import { useAuthStore } from './AuthStore'

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			authId: null,
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
      const auth = getAuth()
      const userId = auth.currentUser?.uid
      if(!userId) return
      const handleUnsubscribe = (unsubscribe) => {
        useAuthStore().setAuthUserUnsubscribe(unsubscribe)
      }
      await fetchResource('users', userId, this, handleUnsubscribe)
      this.authId = userId
    },
    async fetchUser(resourceId){
      await fetchResource('users', resourceId, this, (unsubscribe) => {
        if(!resourceId == useUserStore().authId) {
          useAuthStore().appendUnsubscribe({id: resourceId, unsub: unsubscribe})
        } else {
          return
        }
      })
    },
    async fetchUsers(ids){
      await fetchResources('users', ids, this)
    },
    async createUser({ id, email, name, username, avatar = null }){
      const registeredAt = serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { email, name, username, avatar, registeredAt, usernameLower }
      const newUser = await setResourceWithId('users', user, id, this)
      return newUser
    },
    async registerUserInFirestore({ email, name, username, password, avatar = null }){
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, email, password)
      avatar = await this.uploadAvatar(result.user.uid, avatar)
      await this.createUser({ id: result.user.uid, email, name, username, avatar })
    },
    async registerWithGoogle(){
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      const userData = response.user
      const user = {id: userData.uid, name: userData.displayName, email: userData.email, username: userData.email, avatar: userData.photoURL}
      const userRef = doc(firebase.firestore(), 'users', user.id)
      const userDoc = await getDoc(userRef)
      if(!userDoc.exists()){
        return this.createUser({...user})
      }
    },
    async uploadAvatar(authId, file, filename){
      if(!file) return null
      authId = authId || this.authId
      filename = filename || file.name
      try {
        const storage = getStorage()
        const bucketRef = ref(storage, `uploads/${authId}/images/${Date.now()}-${filename}`)
        const snapshot = await uploadBytes(bucketRef, file)
        const url = await getDownloadURL(snapshot.ref)
        return url
      }
      catch(error) {
        const { addNotification } = useNotifications()
        addNotification('Error uploading image', 5000, 'error')
      }
    },
    async signInWithFirestore({ email, password }){
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
    },
    async signOut(){
      const auth = getAuth()
      await signOut(auth)
      this.authId = null
    },
    async updateUser(editedUser) {
      const updated = {
        avatar: editedUser.avatar || null,
        username: editedUser.username || null,
        usernameLower: editedUser.username.toLowerCase() || null,
        name: editedUser.name || null,
        location: editedUser.location || null,
        bio: editedUser.bio || null,
        website: editedUser.website || null,
        email: editedUser.email || null,
      }
      const updateRef = doc(firebase.firestore(), 'users', editedUser.id)
      await updateDoc(updateRef, {...updated})
		},
  }

})
