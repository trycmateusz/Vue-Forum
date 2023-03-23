<script setup>
import { onMounted } from 'vue'
const emit = defineEmits(['ready'])
onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div claass="col-full">
    <h1>Oops, page not found...</h1>
    <router-link :to="{ name: 'Home' }">
      I suggest you go back!
    </router-link>
  </div>
</template>

<style scoped></style>
