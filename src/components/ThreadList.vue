<script setup>
import { findById } from '@/helpers/'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const props = defineProps({
	threads: {
		type: Array,
		required: true,
	},
})
const findUser = userId => findById(userStore.users, userId) || {}
</script>

<template>
  <div
    class="col-full"
  >
    <div class="thread-list">
      <h2 class="list-title">
        Threads
      </h2>
      <div v-if="props.threads.length">
        <div
          v-for="(thread, index) in props.threads"
          :key="index"
        >
          <div
            v-if="thread != null"
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

              <AppAvatarImage
                class="avatar-medium"
                :src="findUser(thread.userId).avatar"
                alt=""
              />

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
    </div>
    <div
      v-if="!threads.length"
      style="padding: 10px; text-align: center"
    >
      <em>No threads avaiable!</em>
    </div>
  </div>
</template>

<style scoped></style>
