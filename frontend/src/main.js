import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useAuth } from './composables/useAuth'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  position: 'top-right',
  duration: 3000
})

const { checkAuth } = useAuth()
checkAuth().catch(() => {
})

app.mount('#app')
