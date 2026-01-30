import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/styles/tailwind.css'
import './assets/styles/design-tokens.css'
import type { Settings } from '@/types/settings'

const app = createApp(App)

declare global {
  interface Window {
    _settings: Settings
  }
}

// Load settings
const loadSettings = async () => {
  window._settings = await (await fetch('/settings.json')).json()
}

app.use(createPinia())
app.use(router)

loadSettings().then(() => {
  app.mount('#app')
})
