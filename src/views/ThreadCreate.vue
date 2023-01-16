<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { findById } from '@/helpers/'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { useThreadStore } from '@/stores/ThreadStore.js'
import { useForumStore } from '@/stores/ForumStore.js'
const router = useRouter()
const threadStore = useThreadStore()
const forumStore = useForumStore()

const props = defineProps({
	forumId: {
		type: String,
		required: true,
	},
})
const forum = computed(() => {
  return findById(forumStore.forums, props.forumId)
})
const createThread = async (event) => {
  if(!forum.value) return 
  const thread = await threadStore.createThread(event.text, event.title, props.forumId)
  router.push({name: 'ThreadShow', params: { id: thread.id }})
}
const cancel = () => {
  router.push({name: 'Forum', params: { id: forum.value.id }})
}
const { isReady } = useAsyncState(async () => {
  await forumStore.fetchForum(props.forumId, {})
})
</script>

<template>
  <div
    v-if="forum"
    class="col-full push-top"
  >
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>
    <ThreadEditor
      @save="createThread($event)"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped></style>
