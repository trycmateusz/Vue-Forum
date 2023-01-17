<script setup>
import { onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

onMounted(() => {
  userStore.fetchAuthUser()
})
</script>

<template>
  <TheNavbar />
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
