import firebase from 'firebase/compat/app'
import { doc, getDoc, collection, addDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'

export const fetchResource = async (collection, resourceId) => {
  return new Promise(res => {
    const docRef = doc(firebase.firestore(), collection, resourceId)
    const unsub = onSnapshot(docRef, doc => {
      const resource = {...doc.data(), id: doc.id}
      res(resource)
    })
  })
}
export const fetchResources = async (collection, ids) => {
  if(!ids){
    ids = []
  }
  return Promise.all(ids.map(id => fetchResource(collection, id)))
}
export const setResource = async (collection, resource, parent, store) => {
  const { id } = await setResourceInDatabase(collection, resource)
  const newResource = await fetchResource(collection, id, parent, store)
  return newResource
}
export const setResourceInDatabase = async (collectionName, setData) => {
  const setRef = await addDoc(collection(firebase.firestore(), collectionName), setData)
  const snapWithTimestamp = await getDoc(setRef)
  return {...snapWithTimestamp.data(), id: snapWithTimestamp.id}
}
export const setValuesInDatabase = async (collection, resourceId, values) => {
  const updateRef = doc(firebase.firestore(), collection, resourceId)
  await updateDoc(updateRef, values)
}
export const updateDocumentInDatabase = async (collection, resourceId, data) => {
  const updateRef = doc(firebase.firestore(), collection, resourceId)
  const passedKeys = Object.keys(data)
  const passedValues = Object.values(data)
  const updateData = {}
  passedKeys.forEach(key => {
    const index = passedKeys.indexOf(key)
    updateData[key] = arrayUnion(passedValues[index])
  })
  await updateDoc(updateRef, updateData)
}
