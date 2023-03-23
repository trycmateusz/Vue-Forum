<script setup>
const props = defineProps({
  src: {
    type: String,
    default: null
  }
})
</script>
<template>
  <img
    :src="props.src || '/avatar_placeholder.png'"
    alt=""
  >
</template>


<style lang="css" scoped>
img {
  object-fit: cover;
}
</style>