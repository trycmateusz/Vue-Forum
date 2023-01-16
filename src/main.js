import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/index'
import '../style.css'
import App from './App.vue'
import AppDate from './components/AppDate.vue'
import firebase from 'firebase/compat/app'
import firebaseConfig from '@/config/firebase'
import 'firebase/compat/firestore'
import FontAwesome from '@/plugins/fontAwesome.js'
firebase.initializeApp(firebaseConfig)

const pinia = createPinia()
const forumApp = createApp(App)

forumApp.use(pinia).use(router).use(FontAwesome).component('AppDate', AppDate).mount('#app')
