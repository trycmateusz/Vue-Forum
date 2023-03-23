<script setup>
import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue'
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileEditor from '@/components/UserProfileEditor.vue'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()
const postStore = usePostStore()

const props = defineProps({
  edit: {
    type: Boolean,
		default: false
	}
})
const emit = defineEmits(['ready'])
const lastPostFetched = computed(() => {
  if(userStore.authUser.posts.length === 0) return null
  return userStore.authUser.posts[userStore.authUser.posts.length - 1]
})
const { isReady } = useAsyncState(async () => {
  await postStore.fetchAuthUsersPosts(lastPostFetched.value)
  isReady.value = true
  emit('ready')
}) 
</script>

<template>
  <div
    v-if="isReady"
    class="flex-grid"
  >
    <div class="col-3 push-top">
      <UserProfileCard
        v-if="!props.edit"
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
      </div>
      <hr>

      <PostList :posts="userStore.authUser.posts" />
      <AppInfiniteScroll 
        :done="userStore.authUser.posts === userStore.authUser.postsCount"
        @load="postStore.fetchAuthUsersPosts(lastPostFetched)"
      />
    </div>
  </div>
</template>
