<script setup>
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
})
</script>

<template>
  <div class="profile-card">
    <p class="text-center">
      <AppAvatarImage
        :src="props.user.avatar"
        :alt="`${props.user.avatar} profile picture`"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">
      {{ props.user.username }}
    </h1>

    <p class="text-lead">
      {{ props.user.name }}
    </p>

    <p class="text-justify">
      {{ props.user.bio || 'No bio specified' }}
    </p>

    <span class="online">{{ props.user.username }} is online</span>

    <div class="stats">
      <span>{{ userStore.authUser.postsCount }} posts</span>
      <span>{{ userStore.authUser.threadsCount }} threads</span>
    </div>

    <hr>

    <p
      v-if="props.user.website"
      class="text-large text-center"
    >
      <i class="fa fa-globe" /> <a
        :href="'//' + props.user.website"
        target="_blank"
      >{{ props.user.website }}</a>
    </p>
    
    <p
      v-else
      class="text-large text-center"
    >
      No bio or website specified.
    </p>
  </div>
  <div class="text-center">
    <router-link
      :to="{name: 'ProfileEdit'}"
      class="btn-green btn-small"
    >
      Edit Profile
    </router-link>
  </div>
</template>

<style scoped></style>
