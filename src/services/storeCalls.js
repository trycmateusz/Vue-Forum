import {findById, upsert, appendChildToParent} from '@/helpers'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useForumStore } from '@/stores/ForumStore'
import { useThreadStore } from '@/stores/ThreadStore'
import { usePostStore } from '@/stores/PostStore'
import { useUserStore } from '@/stores/UserStore'

export const setResourceInStore = (collection, resource, parent, store) => {
  const storeIfExists = store[collection] || []
  upsert(storeIfExists, resource, parent, collection)
}

export const setValuesInStore = (collection, resourceId, data, store) => {
  const resourceInStore = findById(store[collection], resourceId)
  const passedKeys = Object.keys(data)
  const passedValues = Object.values(data)
  passedKeys.forEach(key => {
    const keyIndex = passedKeys.indexOf(key)
    resourceInStore[key] = passedValues[keyIndex]
  })
}