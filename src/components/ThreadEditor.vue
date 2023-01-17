<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['save', 'cancel'])
const existing = computed(() => {
  return !!props.title
})
const save = (form) => {
  emit('save', { ...form })
}
const cancel = () => emit('cancel')
const form = reactive({ title: props.title, text: props.text })
</script>

<template>
  <form @submit.prevent="save(form)">
    <div class="form-group" />
    <label for="thread_title">Title:</label>
    <input
      id="thread_title"
      v-model="form.title"
      type="text"
      class="form-input"
      name="title"
    >
   

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        id="thread_content"
        v-model="form.text"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      />
    </div>

    <div class="btn-group">
      <button
        class="btn btn-ghost"
        @click="cancel"
      >
        Cancel
      </button>
      <button
        class="btn btn-blue"
        type="submit"
        name="Publish"
      >
        {{ existing ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="">

</style>