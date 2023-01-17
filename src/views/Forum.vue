<script setup>
import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { findById } from '@/helpers/'
import ThreadList from '@/components/ThreadList.vue'
import { useForumStore } from '@/stores/ForumStore'
import { useThreadStore } from '@/stores/ThreadStore'
import { useUserStore } from '@/stores/UserStore'
const forumStore = useForumStore()
const threadStore = useThreadStore()
const userStore = useUserStore()

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})
const forum = computed(() => {
	return findById(forumStore.forums, props.id)
})
const forumThreads = computed(() => {
  if(forum.value.threads) return forum.value.threads.map(threadId => threadStore.getThread(threadId))
  return []
})
const { isReady } = useAsyncState(async () => {
  await forumStore.fetchForum(props.id, {})
  await threadStore.fetchThreads(forum.value.threads, forum.value)
  await userStore.fetchUsers(forumThreads.value.map(thread => thread.userId))
})
</script>

<template>
  <div
    v-if="isReady"
    class="col-full push-top"
  >
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">
          {{ forum.description }}
        </p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params:{ forumId: forum.id } }"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div
    class="col-full push-top"
  >
    <ThreadList
      v-if="isReady"
      :threads="forumThreads"
    />
  </div>
</template>

<style scoped></style>
