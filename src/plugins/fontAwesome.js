import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPencil, faCamera)
export default app => {
  app.component('Fa', FontAwesomeIcon)
}