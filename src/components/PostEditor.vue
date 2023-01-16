<script setup>
import { ref } from 'vue'

const props = defineProps({
	post: {
    type: Object,
    default: () => ({ text: null })
  }
})
const emit = defineEmits(['save-post'])
const postCopy = ref({...props.post})
const savePost = () => {
	const text = postCopy.value.text
	emit('save-post', { text })
	postCopy.value.text = ''
}
</script>

<template>
  <div class="col-full">
    <form @submit.prevent="savePost">
      <div class="form-group">
        <textarea
          id=""
          v-model="postCopy.text"
          name=""
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
