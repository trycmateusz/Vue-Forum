<script setup>
import { ref } from 'vue'

const props = defineProps({
	post: {
    type: Object,
    default: () => ({ text: null })
  }
})
const formKey = ref(Math.random())
const emit = defineEmits(['save-post'])
const postCopy = ref({...props.post})
const savePost = () => {
	const text = postCopy.value.text
	emit('save-post', { text })
	postCopy.value.text = ''
  formKey.value = Math.random()
}
</script>

<template>
  <div class="col-full">
    <VeeForm
      :key="formKey"
      @submit="savePost"
    >
      <AppFormField
        v-model="postCopy.text"
        as="textarea"
        name="text"
        rows="10"
        cols="30"
        rules="required"
      />
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<style scoped></style>
