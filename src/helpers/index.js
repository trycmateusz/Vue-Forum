export const findById = (resources, id) => {
  if(!resources) return null
  return resources.find(r => r.id === id)
}

export const upsert = (resources, resource, parent = {}, parentsResources = '') => {
  if(resources !== []){
    const index = resources.findIndex(r => r.id === resource.id)
    if(resource.id && index != -1){
      resources[index] = resource
    } else {
      resources.push(resource)
    }
  }

  appendChildToParent(parent, parentsResources, resource.id)
}

export const appendChildToParent = (parent, parentsResources, resourceId) => {
  if(!parent) {
    console.warn(`Parent doesn't exist when appending child ${resourceId} to a parent`)
    return
  }
  parent[parentsResources] = parent[parentsResources] || []
  parent[parentsResources].includes(resourceId) ? '' : parent[parentsResources].push(resourceId)
}
export const arrayRandom = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}