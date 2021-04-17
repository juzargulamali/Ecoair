import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/tailwind.css'
import router from './router'
import store from "../src/store/index.js";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleLeft, faAngleRight, faCheck, faFilter, faPencilAlt, faSearch, faTimes, faPlus, faTrash, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheck, faTimes, faAngleLeft, faAngleRight, faSearch, faPencilAlt, faFilter, faPlus, faTrash, faRedoAlt)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(store)
app.use(router)
app.mount('#app')
