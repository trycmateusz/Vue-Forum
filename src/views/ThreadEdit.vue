<script setup>
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
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
	}
})
const emit = defineEmits(['ready'])
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
const formIsDirty = ref(false)
onBeforeRouteLeave(() => {
  if(formIsDirty.value) {
    const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!')
    if(!confirmed) return false
  }
})
const cancel = () => {
  router.push({name: 'ThreadShow', params: { id: thread.value.id }})
}
const { isReady } = useAsyncState(async () => {
  await threadStore.fetchThread(props.id, {})
  await postStore.fetchPost(thread.value.firstPostId, thread)
  emit('ready')
})
</script>

<template>
  <div
    v-if="isReady"
  >
    <div
      v-if="thread"
      class="col-full push-top"
    >
      <h1>
        Editing <i>{{ thread.title }}</i>
      </h1>
      <ThreadEditor
        :title="thread.title"
        :text="text"
        @dirty="formIsDirty = true"
        @clean="formIsDirty = false"
        @save="editThread($event)"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<style scoped></style>
