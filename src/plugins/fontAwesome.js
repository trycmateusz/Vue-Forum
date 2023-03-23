import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPencil, faCamera)
export default app => {
  app.component('Fa', FontAwesomeIcon)
}