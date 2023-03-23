import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import firebase from 'firebase/compat/app'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { useUserStore } from '@/stores/UserStore.js'
export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('unique', async (value, args) => {
    let passedCollection, field
    if (Array.isArray(args)){
      [ passedCollection, field ] = args
    } else {
      ({ passedCollection, field } = args)
    }
    const { authUser } = useUserStore()
    if(authUser && authUser[field] != value){
      const q = query(collection(firebase.firestore(), passedCollection), where(field, '==', value))
      const querySnapshot = await getDocs(q)
      let isNotTaken = true
      querySnapshot.forEach(doc => {
        if(doc.exists()){
          isNotTaken = false
        }
      })
      return isNotTaken
    }
    else {
      return true
    }
  })
  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} is required',
        email: '{field} must be a valid email',
        min: '{field} must be 0:{min} characters long',
        unique: '{field} is already taken'
      }
    }) 
  })
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}