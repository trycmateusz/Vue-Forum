<script setup>
import { ref, reactive } from 'vue'
import PostEditor from '@/components/PostEditor.vue'
import { usePostStore } from '../stores/PostStore'
import { useUserStore } from '../stores/UserStore'
const postStore = usePostStore()
const userStore = useUserStore()

const props = defineProps({
	posts: {
		type: Array,
		required: true,
	},
})
const findUser = userId => {
  return userStore.user(userId)
}
const editing = ref(null)
const toggleEditMode = (id) => {
  editing.value = id === editing.value ? null : id
}
const handleUpdate = (event) => {
  usePostStore().updatePost(event.text, editing.value)
  editing.value = null
}
</script>

<template>
  <div class="post-list">
    <div
      v-for="post in posts"
      :key="post.id"
      class="post"
    >
      <div
        v-if="findUser(post.userId)"
        class="user-info"
      >
        <a
          href="#"
          class="user-name"
        >
          {{ findUser(post.userId).name }}
        </a>
        <a href="#">
          <img
            class="avatar-large"
            :src="findUser(post.userId).avatar"
            alt="User avatar"
          >
        </a>
        <p class="desktop-only text-small">
          {{ findUser(post.userId).postsCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ findUser(post.userId).threadsCount }} threads
        </p>
      </div>
      <div class="post-content">
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save-post="handleUpdate"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          v-if="post.userId === useUserStore().authId"
          href="#"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Make a change"
          @click.prevent="toggleEditMode(post.id)"
        >
          <Fa icon="pencil" />
        </a>
      </div>
      <div class="post-date text-faded">
        <div
          v-if="post.edited?.at"
          class="edition-info"
        >
          edited
        </div>
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
