<script setup>
import { useNotifications } from '@/composables/useNotifications.js'
const { notifications, removeNotification } = useNotifications()
</script>

<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="`notification-type-${notification.type}`"
        class="notification"
      >
        <span>{{ notification.message }}</span>
        <button @click.prevent="removeNotification(notification.id)">
          x
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped lang="css">
 .notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}
.notification {
  background: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rbga(0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}
.notification.notification-type-error{
  border-left: 5px solid rgb(146, 5, 5)
}
.notification-enter-active,
.notification-leave-active {
  transition: all .5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.8s ease;
}
</style>