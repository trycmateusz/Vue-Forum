<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const emit = defineEmits(['ready'])
const route = useRoute()
const router = useRouter()
const forum = computed(() => {
	return findById(forumStore.forums, props.id)
})
const forumThreads = computed(() => {
  if(forum.value?.threads) {
    return threadStore.threads
    .filter(thread => thread.forumId === forum.value.id)
    .map(thread => threadStore.getThread(thread.id))
  } 
  return []
})
const page = ref(parseInt(route.query.page) || 1)
const perPage = 10
const totalPages = computed(() => {
  if (!forum.value?.threads) return 0
  return Math.ceil(forum.value.threads.length / perPage)
})
watch(page, async () => {
  router.push({query: { page: page.value }})
})
const { isReady } = useAsyncState(async () => {
  await forumStore.fetchForum(props.id, {})
  const threads = await threadStore.fetchThreadsByPage(forum.value.threads, page.value, perPage)
  await userStore.fetchUsers(threads.map(thread => thread.userId))
  emit('ready')
})
</script>

<template>
  <div
    v-if="isReady"
    class="col-full"
  >
    <AppHead>
      <title>{{ forum?.name }}</title>
      <meta
        property="og:title"
        :content="forum?.name"
      >
      <meta
        property="twitter:title"
        :content="forum?.name"
      >
    </AppHead>
    <div
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
        :threads="forumThreads"
      />
      <v-pagination 
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
      />
    </div>
  </div>
</template>

<style scoped></style>
