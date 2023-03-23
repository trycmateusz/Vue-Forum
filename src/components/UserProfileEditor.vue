<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserProfileEditorRandomAvatar from '@/components/UserProfileEditorRandomAvatar.vue'
import UserProfileEditorReauthenticate from '@/components/UserProfileEditorReauthenticate.vue'
import { useNotifications } from '@/composables/useNotifications.js'
import { useUserStore } from '@/stores/UserStore'
import { useAuthStore } from '@/stores/AuthStore'
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
})
const { addNotification } = useNotifications()
const uploadingImage = ref(false)
const handleAvatarUpload = async (e) => {
  uploadingImage.value = true
  const file = e.target.files[0]
  const uploadedImage = await userStore.uploadAvatar(null, file)
  activeUser.value.avatar = uploadedImage || activeUser.value.avatar
  uploadingImage.value = false
}
const handleRandomAvatarUpload = async () => {
  const randomAvatarGenerated = activeUser.value.avatar.startsWith('https://pixabay')
  if(randomAvatarGenerated) {
    const image = await fetch(activeUser.value.avatar)
    const blob = await image.blob()
    const uploadedImage = await userStore.uploadAvatar(null, blob, 'random')
    activeUser.value.avatar = uploadedImage || activeUser.value.avatar
  }
}
const locationOptions = ref([])
const loadLocationOptions = async () => {
  if(!locationOptions.value.length){
    const res = await fetch('https://restcountries.com/v3.1/all')
  locationOptions.value = await res.json()
  }
}
const needsReAuth = ref(false)
const cancelEdit = () => {
	router.push({
		name: 'Profile'
	})
}
const saveUserData = async () => {
  await userStore.updateUser(activeUser.value)
  cancelEdit()
  addNotification('User successfully updated', 3000)
}
const onReauthenticated = async () => {
  needsReAuth.value = false
  const emailChanged = activeUser.value.email !== props.user.email
  if(newPassword.value != ''){
    await authStore.updatePasswordInFirebase(newPassword.value)
  }
  if(emailChanged){
    await authStore.updateEmailInFirebase(activeUser.value.email)
  }
  saveUserData()
}
const onReauthenticatedFailed = async () => {
  addNotification('Error updating user', 5000, 'error')
  cancelEdit()
}
const save = async () => {
  await handleRandomAvatarUpload()
  const emailChanged = activeUser.value.email !== props.user.email
  if(emailChanged || newPassword.value != ''){
    if(newPassword.value != ''){
      if(newPassword.value != newPasswordConfirm.value){
        addNotification('Mismatched password', 5000, 'error')
      }
      else {
        needsReAuth.value = true
      }
    }
    else {
      needsReAuth.value = true
    }
  } else {
    saveUserData()
  }
}
const newPassword = ref('')
watch(newPassword, () => {
  if(newPassword.value.length < 8){
    newPasswordConfirm.value = ''
  }
})
const newPasswordConfirm = ref('')
const activeUser = ref({...props.user})
</script>

<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImage
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner
              v-if="uploadingImage"
              color="white"
            />
            <Fa
              v-else
              icon="fa-solid fa-camera"
              size="3x"
              :style="{color: 'white', opacity: '.8'}"
            />
          </div>
          <input
            v-show="false"
            id="avatar"
            type="file"
            accept="image/*"
            @change="handleAvatarUpload"
          >
        </label>
      </p>
      <UserProfileEditorRandomAvatar @hit="activeUser.avatar = $event" />
      <AppFormField
        v-model="activeUser.username"
        name="username"
        type="text"
        placeholder="Username"
        rules="required|unique:users,username"
      />

      <AppFormField
        v-model="activeUser.name"
        name="name"
        type="text"
        placeholder="Full name"
        rules="required"
      />

      <AppFormField
        id="user_bio"
        v-model="activeUser.bio"
        label="Bio"
        name="bio"
        placeholder="Write a few word about yourself."
      />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <AppFormField
        v-model="activeUser.website"
        label="Website"
        name="website"
        type="text"
        autocomplete="off"
      />

      <AppFormField
        v-model="activeUser.location"
        label="Location"
        name="location"
        autocomplete="off"
        list="locations"
        @mouseenter="loadLocationOptions"
      />
      <datalist id="locations">
        <option
          v-for="location in locationOptions"
          :key="location.name.common"
          :value="location.name.common"
        />
      </datalist>

      
      <AppFormField
        v-model="activeUser.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="off"
        rules="required|unique:users,email"
      />

      <AppFormField
        v-model="newPassword"
        label="Password"
        name="password"
        type="password"
        autocomplete="off"
        rules="min:8"
        placeholder="Change it here."
      />

      <AppFormField
        v-model="newPasswordConfirm"
        label="Password confirmation"
        name="password_confirm"
        type="password"
        :disabled="newPassword.length < 8"
        placeholder="Confirm password change."
      />

      <div class="btn-group space-between">
        <button
          class="btn-ghost"
          @click.prevent="cancelEdit"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn-blue"
        >
          Save
        </button>
      </div>
    </VeeForm>
    <UserProfileEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<style scoped></style>
