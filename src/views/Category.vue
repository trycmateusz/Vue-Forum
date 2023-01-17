<script setup>
import { computed } from 'vue'
import { findById } from '@/helpers/'
import { useAsyncState } from '@vueuse/core'
import ForumList from '@/components/ForumList.vue'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useForumStore } from '@/stores/ForumStore'
const categoryStore = useCategoryStore()
const forumStore = useForumStore()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
const category = computed(() =>{
  return findById(categoryStore.categories, props.id)
})
const { isReady } = useAsyncState(async () => {
  await categoryStore.fetchCategory(props.id)
  await forumStore.fetchForums(category.value.forums, category.value)
}, undefined)
</script>

<template>
  <div class="col-full">
    <div
      v-if="isReady"
      class="col-full push-top"
    >
      <h1>
        {{ category.name }}
      </h1>
    </div>
    <div
      v-if="isReady"
      class="col-full"
    >
      <div class="forum-list">
        <h2 class="list-title">
          {{ category.name }}
        </h2>
        <ForumList
          v-if="category.forums"
          :forums="category.forums"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
