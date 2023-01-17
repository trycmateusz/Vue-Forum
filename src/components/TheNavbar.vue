<script setup>
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()
</script>

<template>
  <header
    id="header"
    class="header"
  >
    <router-link  
      :to="{name: 'Home'}"
      class="logo"
    >
      <img src="../assets/svg/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar" />
      <div class="middle bar" />
      <div class="bottom bar" />
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>
        <li
          v-if="userStore.authUser"
          class="navbar-user"
        >
          <router-link :to="{name: 'Profile'}">
            <img
              class="avatar-small"
              :src="userStore.authUser.avatar"
              :alt="`${userStore.authUser.name}`"
            >
            <span>
              {{ userStore.authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              >
            </span>
          </router-link>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown">
            <div class="triangle-drop" />
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <a href="profile.html">View profile</a>
              </li>
              <li class="dropdown-menu-item">
                <a href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <!-- <ul>
				<li class="navbar-item">
					<a href="index.html">Home</a>
				</li>
				<li class="navbar-item">
					<a href="category.html">Category</a>
				</li>
				<li class="navbar-item">
					<a href="forum.html">Forum</a>
				</li>
				<li class="navbar-item">
					<a href="thread.html">Thread</a>
				</li>

				<li class="navbar-item mobile-only"> show mobile only
					<a href="profile.html">My Profile</a>
				</li>
				<li class="navbar-item mobile-only">
					<a href="#">Logout</a>
				</li>
			</ul> -->
    </nav>
  </header>
</template>

<style scoped></style>
