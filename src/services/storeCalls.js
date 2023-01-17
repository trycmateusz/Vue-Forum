import { findById } from '@/helpers'

export const setValuesInStore = (collection, resourceId, data, store) => {
  const resourceInStore = findById(store[collection], resourceId)
  const passedKeys = Object.keys(data)
  const passedValues = Object.values(data)
  passedKeys.forEach(key => {
    const keyIndex = passedKeys.indexOf(key)
    resourceInStore[key] = passedValues[keyIndex]
  })
}