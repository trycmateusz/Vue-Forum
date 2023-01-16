<script setup>
import { ref, reactive, onMounted } from 'vue'
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileEditor from '@/components/UserProfileEditor.vue'
import { useUserStore } from '@/stores/UserStore'
import { usePostStore } from '@/stores/PostStore'
import { useThreadStore } from '@/stores/ThreadStore'
const userStore = useUserStore()

const props = defineProps({
	edit: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
  <div class="container">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard
          v-if="!edit"
          :user="userStore.authUser"
        />
        <UserProfileEditor
          v-else
          :user="userStore.authUser"
        />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ userStore.authUser.name }}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr>

        <PostList :posts="userStore.authUser.posts" />
      </div>
    </div>
  </div>
</template>
