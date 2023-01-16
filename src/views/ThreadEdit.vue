<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncState } from '@vueuse/core'
import { findById } from '@/helpers'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { useThreadStore } from '@/stores/ThreadStore.js'
import { usePostStore } from '@/stores/PostStore.js'
const router = useRouter()
const threadStore = useThreadStore()
const postStore = usePostStore()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
const thread = computed(() => {
  return findById(threadStore.threads, props.id)
})
const text = computed(() => {
  return findById(postStore.posts, thread.value.posts[0]).text
})
const editThread = async (event) => {
  const thread = await threadStore.updateThread(event.text, event.title, props.id)
  router.push({name: 'ThreadShow', params: { id: thread.id }})
}
const cancel = () => {
  router.push({name: 'ThreadShow', params: { id: thread.value.id }})
}
const { isReady } = useAsyncState(async () => {
  await threadStore.fetchThread(props.id, {})
  await postStore.fetchPost(thread.value.firstPostId, thread)
})
</script>

<template>
  <div
    v-if="isReady"
    class="col-full push-top"
  >
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="editThread($event)"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped></style>
