<script setup>
import { ref, computed } from 'vue'
import { useForumStore } from '@/stores/ForumStore'
const forumStore = useForumStore()

const props = defineProps({
	forums: {
		type: Array,
		required: true,
	},
})
const forumsInCategory = computed(() => {
	return forumStore.forums.filter(forum =>
		props.forums.includes(forum.id)
	)
})
</script>

<template>
  <div
    v-for="forum in forumsInCategory"
    :key="forum.id"
    class="forum-listing"
  >
    <div class="forum-details">
      <router-link
        :to="{ name: 'Forum', params: { id: forum.id } }"
        class="text-xlarge"
        href="#"
      >
        {{ forum.name }}
      </router-link>
      <p>{{ forum.description }}</p>
    </div>

    <div class="threads-count">
      <p>
        <span class="count">{{
          forum.threads ? forum.threads.length : '0'
        }}</span>
        {{
          forum.threads?.length
            ? forum.threads?.length > 1
              ? 'threads'
              : 'thread'
            : 'threads'
        }}
      </p>
    </div>

    <div class="last-thread" />
  </div>
</template>

<style scoped></style>
