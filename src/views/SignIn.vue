<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const emit = defineEmits(['ready'])
const router = useRouter()
const route = useRoute()
const form = reactive({
  email: '',
  password: ''
})
const signIn = async () => {
  try {
    await userStore.signInWithFirestore({...form})
    successRedirect()
  } 
  catch(error) {
    alert(error.message)
  }
}
const signInWithGoogle = async () => {
  try {
    await userStore.registerWithGoogle()
    successRedirect()
  }
  catch(error) {
    alert(error.message)
  }
}
const successRedirect = () => {
  const redirectTo = route.query.redirectTo || { name: 'Home' }
  router.push(redirectTo)
}
onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm
        class="card card-form"
        @submit="signIn"
      >
        <h1 class="text-center">
          Login
        </h1>

        <AppFormField
          v-model="form.email"
          label="Email"
          name="email"
          type="email"
          rules="required|email"
        />
        
        <AppFormField
          v-model="form.password"
          label="Password"
          name="password"
          type="password"
          rules="required|min:8"
        />

        <div class="push-top">
          <button
            type="submit"
            class="btn-blue btn-block"
          >
            Log in
          </button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register'} ">
            Create an account?
          </router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button
          class="btn-red btn-xsmall"
          @click="signInWithGoogle"
        >
          <i class="fa fa-google fa-btn" />Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="">

</style>