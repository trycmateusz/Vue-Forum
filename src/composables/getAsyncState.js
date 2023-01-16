import { useAsyncState } from '@vueuse/core'

export const getAsyncState = (fetchFunctions) => {
  const { state, isReady, isLoading } = useAsyncState(async (fetchFunctions) => {
    await fetchFunctions()
  }, undefined)
  return { state, isReady, isLoading }
}