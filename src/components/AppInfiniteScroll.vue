<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'

const props = defineProps({
  done: { 
    type: Boolean,
    default: false 
  }
})
const emit = defineEmits(['load'])
const root = ref(null)
let observer
watch(props, () => {
  if(props.done) observer.unobserve(root.value)
})
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) emit('load')
  })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.9
  })
  observer.observe(root.value)
})
onBeforeUnmount(() => {
  observer.unobserve(root.value)
})
</script>

<template>
  <div
    ref="root"
    class="intersection-observer"
  />
</template>

<style scoped lang="css">
  div {
    position: relative;
    bottom: 200px;
    pointer-events: none;
    z-index: -1
  }
</style>