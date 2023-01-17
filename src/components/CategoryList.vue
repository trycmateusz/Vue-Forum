<script setup>
import ForumList from '@/components/ForumList.vue'

const props = defineProps({
	categories: {
		type: Array,
		required: true,
	},
})
</script>

<template>
  <div
    v-for="category in props.categories"
    :key="category.id"
    class="forum-list"
  >
    <h2 class="list-title">
      <router-link
        :to="{ name: 'Category', params: { id: category.id } }"
      >
        {{ category.name }}
      </router-link>
    </h2>
    <ForumList :forums="category.forums" />
  </div>
</template>

<style scoped></style>
