<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore.js'
import { VueFinalModal } from 'vue-final-modal'
const authStore = useAuthStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['fail', 'success', 'update:modelValue'])
const email = ref('')
const password = ref('')
const showModal = computed(({
  get () {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
}))
const reauthenticate = async () => {
  try {
    await authStore.reauthenticateUser(email.value, password.value)
    emit('success')
  }
  catch (error) {
    emit('fail', error)
  }
}
</script>

<template>
  <VueFinalModal
    v-model="showModal"
    classes="modal-container"
    content-class="modal"
  >
    <div class="modal-content">
      <h4>Login Again to Change Your Email Or Password</h4>
      <VeeForm @submit="reauthenticate">
        <AppFormField
          v-model="email"
          name="reauth-email"
          label="Email"
          rules="email"
        />
        <AppFormField
          v-model="password"
          name="reauth-password"
          label="Password"
          type="password"
        />
        <button class="btn btn-green btn-small">
          Login
        </button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<style lang="scss" scoped>

</style>