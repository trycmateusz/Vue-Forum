<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()
const isReady = ref(false)
const showPage = () => {
  isReady.value = true
}

onMounted(async () => {
  await userStore.fetchAuthUser()
  router.beforeEach(() => {
    isReady.value = false
  })
})
</script>

<template>
  <TheNavbar />
  <div class="container">
    <RouterView
      v-show="isReady"
      :key="`${route.path}${JSON.stringify(route.query)}`"
      @ready="showPage"
    />
    <AppSpinner v-show="!isReady" />
    <AppNotifications />
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
