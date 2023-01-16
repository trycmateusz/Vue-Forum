<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

const props = defineProps({
	timestamp: {
		required: true,
		type: [Number, Object],
	},
})
const normalizedTimestamp = computed(() => {
  return props.timestamp?.seconds || props.timestamp
})
const dateForHumans = computed(() => {
	return dayjs.unix(normalizedTimestamp.value).fromNow()
})
const exactDateForHumans = computed(() => {
	return dayjs.unix(normalizedTimestamp.value).format('llll')
})
</script>

<template>
  <time :title="exactDateForHumans">
    {{ dateForHumans }}
  </time>
</template>

<style scoped></style>
