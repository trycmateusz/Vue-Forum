<script>
export default {
  inheritAttrs: false
}
</script>
<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['modelUpdate'])

</script>

<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :id="name"
      :model-value="modelValue"
      :name="name"
      :label="label"
      class="form-input"
      :="$attrs"
      @input="emit('modelUpdate', e)"
    />
    <VeeErrorMessage
      :name="name"
      class="form-error"
    />
  </div>
</template>
