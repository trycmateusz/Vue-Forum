<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore.js'
const userStore = useUserStore()

const emit = defineEmits(['ready'])
const router = useRouter()
const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: ''
})
const avatarPreview = ref(null)
const register = async () => {
  userStore.registerUserInFirestore({...form})
  router.push('/')
}
const registerWithGoogle = async () => {
  await userStore.registerWithGoogle()
  router.push('/')
}
const handleImageUpload = async (e) => {
  form.avatar = e.target.files[0]
  const reader = new FileReader()
  reader.onload = e => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(form.avatar)
}
onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm
        action=""
        class="card card-form"
        @submit="register"
      >
        <h1 class="text-center">
          Register
        </h1>

        <AppFormField
          v-model="form.name"
          name="name"
          label="Name"
          rules="required"
        />

        <AppFormField
          v-model="form.username"
          name="username"
          label="Username"
          rules="required"
        />

        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          rules="required|email|unique:users,email"
          type="email"
        />

        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          rules="required|min:8"
          type="password"
        />

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <div v-if="avatarPreview">
            <img
              :src="avatarPreview"
              alt="Uploaded avatar"
              class="avatar-xlarge"
            >
          </div>
          <VeeField
            v-show="!avatarPreview"
            id="avatar"
            name="avatar"
            type="file"
            class="form-input"
            accept="image/*"
            @change="handleImageUpload"
          />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-blue btn-block"
          >
            Register
          </button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button
          class="btn-red btn-xsmall"
          @click="registerWithGoogle"
        >
          <i class="fa fa-google fa-btn" />Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="">

</style>