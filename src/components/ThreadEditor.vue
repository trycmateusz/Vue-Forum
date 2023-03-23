<script setup>
import { reactive, computed, watch } from 'vue'

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
const emit = defineEmits(['save', 'cancel', 'dirty', 'clean'])
const existing = computed(() => {
  return !!props.title
})
const save = (form) => {
  emit('clean')
  emit('save', { ...form })
}
const cancel = () => emit('cancel')
const form = reactive({ title: props.title, text: props.text })
watch(form, () => {
  if(form.title != props.title || form.text != props.text) {
    emit('dirty')
  }
  else {
    emit('clean')
  }
})
</script>

<template>
  <VeeForm @submit="save(form)">
    <AppFormField
      v-model="form.title"
      label="Title"
      name="title"
      rules="required"
    />
    <AppFormField
      v-model="form.text"
      as="textarea"
      label="Content"
      name="text"
      rules="required"
      rows="8" 
      cols="140"
    />

    <div class="btn-group">
      <button
        class="btn btn-ghost"
        @click.prevent="cancel"
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
  </VeeForm>
</template>

<style scoped lang="">

</style>