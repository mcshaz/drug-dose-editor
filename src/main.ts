import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
// import 'bootstrap/dist//js/bootstrap.bundle.min.js'

// for ie need AbortController polyfill

import FontAwesomeIcon from '@/services/fontAwesome'
import { FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('font-awesome-layers', FontAwesomeLayers)
  .use(router)
  .mount('#app')
