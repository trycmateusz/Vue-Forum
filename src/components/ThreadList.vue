<script setup>
import { ref, reactive } from 'vue'
import { findById } from '@/helpers/'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'
const postStore = usePostStore()
const userStore = useUserStore()

const props = defineProps({
	threads: {
		type: Array,
		required: true,
	},
})
const findPost = postId => findById(postStore.posts, postId)
const findUser = userId => findById(userStore.users, userId) || {}
</script>

<template>
  <div
    v-if="props.threads.length > 0"
    class="col-full"
  >
    <div class="thread-list">
      <h2 class="list-title">
        Threads
      </h2>

      <div
        v-for="thread in props.threads"
        :key="thread.id"
        class="thread"
      >
        <div>
          <p>
            <router-link
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
            >
              {{ thread.title }}
            </router-link>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ findUser(thread.userId).name }}</a>, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p
            class="replies-count"
          >
            {{ thread.posts.length }} replies
          </p>

          <img
            class="avatar-medium"
            :src="findUser(thread.userId).avatar"
            alt=""
          >

          <div>
            <p class="text-xsmall">
              <a href="#">{{ findUser(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
