import firebase from 'firebase/compat/app'
import { query, where, orderBy, limit, startAfter, doc, getDoc, getDocs, collection, addDoc, setDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import { upsert, findById } from '@/helpers'
import { useAuthStore } from '@/stores/AuthStore'

export const fetchResource = async (resourceCollection, resourceId, store, handleUnsubscribe = null, handleOnSnapshot = null) => {
  return new Promise(res => {
    const isSubscribed = findById(useAuthStore().unsubscribes, resourceId)
    if(!isSubscribed && isSubscribed !== null){
      const docRef = doc(firebase.firestore(), resourceCollection, resourceId)
      const unsubscribe = onSnapshot(docRef, doc => {
        if(doc.exists()) {
          let unchangedResource = findById(store[resourceCollection], resourceId)
          unchangedResource = unchangedResource ? {...unchangedResource} : null
          const resource = {...doc.data(), id: doc.id}
          upsert(store[resourceCollection], resource)
          if(typeof handleOnSnapshot === 'function'){
            const isLocal = doc.metadata.hasPendingWrites
            handleOnSnapshot(isLocal, unchangedResource, resource)
          }
          res(resource)
        } else {
          res(null)
        }
      }) 
      if(handleUnsubscribe){
        handleUnsubscribe(unsubscribe)
      }
      else {
        useAuthStore().appendUnsubscribe({id: resourceId, unsub: unsubscribe})
      }
    } else {
      res(null)
    }
  })
}
export const fetchOnConditions = async(resourceCollection, store, passedConditions, handleUnsubscribe) => {
  let conditions = []
  if(passedConditions.where) {
    conditions.push(where(...passedConditions.where))
  }
  if(passedConditions.orderBy) {
    conditions.push(orderBy(...passedConditions.orderBy))
  }
  if(passedConditions.limit) {
    conditions.push(limit(passedConditions.limit))
  }
  const waitForPost = async () => {
    if(passedConditions.startAfter) {
      const docRef = doc(firebase.firestore(), resourceCollection, passedConditions.startAfter.id)
      const docSnap = await getDoc(docRef)
      conditions.push(startAfter(docSnap))
    }
  }
  await waitForPost()
  let q = query(collection(firebase.firestore(), resourceCollection), ...conditions)
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(async doc => {
    await fetchResource(resourceCollection, doc.id, store, handleUnsubscribe)
  })
  return querySnapshot
}
export const fetchResources = async (collection, ids, store, handleOnSnapshot) => {
  ids = ids || []
  return await Promise.all(ids.map(id => fetchResource(collection, id, store, null, handleOnSnapshot)))
}
export const setResource = async (collection, resource, store) => {
  const { id } = await setResourceInDatabase(collection, resource)
  const newResource = await fetchResource(collection, id, store)
  return newResource
}
export const setResourceWithId = async (collection, resource, resourceId, store) => {
  const docRef = doc(firebase.firestore(), collection, resourceId)
  await setDoc(docRef, resource)
  const newResource = await fetchResource(collection, resourceId, store)
  return newResource
}
export const setResourceInDatabase = async (collectionName, setData) => {
  const setRef = await addDoc(collection(firebase.firestore(), collectionName), setData)
  const snapWithTimestamp = await getDoc(setRef)
  return {...snapWithTimestamp.data(), id: snapWithTimestamp.id}
}
export const uniteArrayForDatabase = async (collection, resourceId, data) => {
  const updateRef = doc(firebase.firestore(), collection, resourceId)
  const passedKeys = Object.keys(data)
  const passedValues = Object.values(data)
  const updateData = {}
  passedKeys.forEach(key => {
    const index = passedKeys.indexOf(key)
    updateData[key] = arrayUnion(passedValues[index])
  })
  return { updateRef, updateData }
}
