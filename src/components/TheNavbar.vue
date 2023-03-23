<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const router = useRouter()
const isDropdownActive = ref(false)
const isMobileNavActive = ref(false)
onMounted(() => {
  router.beforeEach(() => {
    isMobileNavActive.value = false
  })
})
</script>

<template>
  <header
    id="header"
    v-click-outside="() => isMobileNavActive = false"
    v-page-scroll="() => isMobileNavActive = false"
    class="header"
  >
    <router-link  
      :to="{name: 'Home'}"
      class="logo"
    >
      <img src="../assets/svg/vueschool-logo.svg">
    </router-link>

    <div
      class="btn-hamburger"
      @click="isMobileNavActive = !isMobileNavActive"
    >
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar" />
      <div class="middle bar" />
      <div class="bottom bar" />
    </div>

    <!-- use .navbar-open to open nav -->
    <nav
      class="navbar"
      :class="{ 'navbar-open': isMobileNavActive}"
    >
      <ul>
        <li
          v-if="userStore.authUser"
          class="navbar-user"
        >
          <a
            v-click-outside="() => isDropdownActive = false"
            @click.prevent="isDropdownActive = !isDropdownActive"
          >
            <AppAvatarImage
              class="avatar-small"
              :src="userStore.authUser.avatar"
              :alt="`${userStore.authUser.name}`"
            />
            <span>
              {{ userStore.authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              >
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div
            id="user-dropdown"
            :class="{'active-drop' : isDropdownActive}"
          >
            <div class="triangle-drop" />
            <ul
              class="dropdown-menu"
            >
              <li class="dropdown-menu-item">
                <router-link :to="{name: 'Profile'}">
                  View profile 
                </router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click="userStore.signOut(), router.push({ name: 'Home' })">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li
          v-if="!userStore.authUser"
          class="navbar-item"
        >
          <router-link :to="{name: 'SignIn'}">
            Sign In
          </router-link>
        </li>
        <li
          v-if="!userStore.authUser"
          class="navbar-item"
        >
          <router-link :to="{name: 'Register'}">
            Register
          </router-link>
        </li>
        <li
          v-if="userStore.authUser"
          class="navbar-mobile-item"
        >
          <router-link :to="{name: 'Profile'}">
            View Profile
          </router-link>
        </li>
        <li
          v-if="userStore.authUser"
          class="navbar-mobile-item"
        >
          <a @click.prevent="authStore.signOut(), router.push({ name: 'Home' })">
            Sign Out
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped></style>
