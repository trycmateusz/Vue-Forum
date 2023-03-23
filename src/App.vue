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
  <AppHead>
    <title>Vue.js 3 Master Class Forum</title>
    <meta
      name="description"
      content="An awesome Vue.js 3 powered forum!"
    >

    <!-- Social -->
    <meta
      property="og:title"
      content="Vue.js 3 Master Class Forum"
    >
    <meta
      property="og:description"
      content="An Awesome Vue.js 3 powered forum!"
    >
    <meta
      property="og:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    >

    <!-- Twitter -->
    <meta
      name="twitter:title"
      content="Vue.js 3 Master Class Forum"
    >
    <meta
      name="twitter:description"
      content="An Awesome Vue.js 3 powered forum!"
    >
    <meta
      name="twitter:image"
      content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"
    >
    <meta
      name="twitter:card"
      content="summary_large_image"
    >
  </AppHead>
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
