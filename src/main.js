import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import router from '@/router/index'
import '../style.css'
import App from './App.vue'
import AppDate from './components/AppDate.vue'
import AppSpinner from './components/AppSpinner.vue'
import AppNotifications from '@/components/AppNotifications.vue'
import AppAvatarImage from '@/components/AppAvatarImage.vue'
import AppFormField from '@/components/AppFormField.vue'
import AppHead from '@/components/AppHead.vue'
import firebase from 'firebase/compat/app'
import firebaseConfig from '@/config/firebase'
import 'firebase/compat/firestore'
import FontAwesome from '@/plugins/fontAwesome.js'
import veeValidate from '@/plugins/veeValidate.js'
import clickOutsideDirective from './plugins/clickOutsideDirective'
import pageScrollDirective from './plugins/pageScrollDirective'
import vue3Pagination from './plugins/vue3Pagination'

const head = createHead()

const pinia = createPinia()
const forumApp = createApp(App)

firebase.initializeApp(firebaseConfig)

forumApp
.use(head)
.use(pinia)
.use(router)
.use(FontAwesome)
.use(clickOutsideDirective)
.use(veeValidate)
.use(pageScrollDirective)
.use(vue3Pagination)
.component('AppDate', AppDate)
.component('AppSpinner', AppSpinner)
.component('AppNotifications', AppNotifications)
.component('AppAvatarImage', AppAvatarImage)
.component('AppFormField', AppFormField)
.component('AppHead', AppHead)
.mount('#app')
