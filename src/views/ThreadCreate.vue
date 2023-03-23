<script setup>
import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
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
const emit = defineEmits(['ready'])
const forum = computed(() => {
  return findById(forumStore.forums, props.forumId)
})
const createThread = async (event) => {
  if(!forum.value) return 
  const thread = await threadStore.createThread(event.text, event.title, props.forumId)
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
  router.push({name: 'Forum', params: { id: forum.value.id }})
}
const { isReady } = useAsyncState(async () => {
  await forumStore.fetchForum(props.forumId, {})
  emit('ready')
})
</script>

<template>
  <div
    v-if="isReady"
    class="col-full push-top"
  >
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>
    <ThreadEditor
      text=""
      title=""
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
      @save="createThread($event)"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped></style>
