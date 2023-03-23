<script setup>
import { computed, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import difference from 'lodash/difference'
import AppDate from '@/components/AppDate.vue'
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { useNotifications } from '@/composables/useNotifications.js'
import { useThreadStore } from '@/stores/ThreadStore'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'
const threadStore = useThreadStore()
const postStore = usePostStore()
const userStore = useUserStore()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
const emit = defineEmits(['ready'])
const { addNotification } = useNotifications()
const thread = computed(() => {
  return threadStore.getThread(props.id)
})
const postsInThread = computed(() =>
	postStore.posts.filter(post => post.threadId === props.id)
)
const addPost = (event, thread) => {
	const post = { text: event.text, threadId: thread.id }
	postStore.createPost(post, thread)
}
watch(thread, async () => {
  if(!isReady.value) return
  await postStore.fetchPost(thread.value.lastPostId, (isLocal, previousItem) => {
    if(isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
    addNotification('Post recently updated', 5000)
  })
})
const { isReady } = useAsyncState(async () => {
  await threadStore.fetchThread(props.id, (isLocal, previousItem, item) => {
    if(!isReady.value || isLocal) return
    const newPosts = difference(item.posts, previousItem.posts)
    const hasNewPosts = newPosts.length > 0
    if(!hasNewPosts){
      addNotification('Thread recently updated', 5000)
    }
  })
  await postStore.fetchPosts(thread.value.posts, (isLocal, previousItem) => {
    if(!isReady.value || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
    addNotification('Post recently updated', 5000)
  })
  await userStore.fetchUsers(thread.value.contributors, {})
  await userStore.fetchUser(thread.value.userId, {})
  emit('ready')
})
</script>

<template>
  <div
    v-if="isReady"
    class="col-large push-top"
  >
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === userStore.authUser?.id"
        v-slot="{navigate}"
        :to="{name: 'ThreadEdit', id: props.id}"
        custom=""
      >
        <button
          class="btn-green btn-small"
          @click="navigate"
        >
          Edit Thread
        </button>
      </router-link>
    </h1>

    <p v-if="thread.author">
      By <a
        href="#"
        class="link-unstyled"
      >{{ thread.author?.name }}</a>, <AppDate
        v-if="thread.publishedAt"
        :timestamp="thread.publishedAt"
      />.
      <span
        style="float:right; margin-top: 2px;"
        class="hide-mobile text-faded text-small"
      ><span v-if="thread.repliesCount === 0 && thread.contributors">No replies</span>
        <span v-else>
          {{ thread.repliesCount }} 
          {{ thread.repliesCount > 1 ? 'replies' : 'reply' }} by 
          {{ thread.contributorsCount }} 
          {{ thread.contributorsCount > 1 ? 'contributors' : 'contributor' }}
        </span>
      </span>
    </p>

    <PostList :posts="postsInThread" />
    <PostEditor
      v-if="userStore.authUser"
      @save-post="addPost($event, thread)"
    />
    <div
      v-else
      class="text-center"
      style="margin-bottom: 50px;"
    >
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">
        Sign In
      </router-link> or <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">
        Register
      </router-link> to reply.
    </div>
  </div>
</template>
