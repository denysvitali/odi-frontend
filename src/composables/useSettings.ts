import { ref, onMounted } from 'vue'
import type { Settings } from '@/types/settings'

export function useSettings() {
  const settings = ref<Settings | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const loadSettings = async (): Promise<Settings | null> => {
    loading.value = true
    error.value = null

    try {
      let response: Response

      if (window.location.hostname === 'odi.denv.it') {
        // Mock on GitHub pages
        response = await fetch('/settings-mock.json')
      } else {
        response = await fetch('/settings.json')
      }

      if (!response.ok) {
        throw new Error(`Failed to load settings: ${response.statusText}`)
      }

      const data: Settings = await response.json()
      settings.value = data

      // Also set on window for backward compatibility
      window._settings = data

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load settings'
      console.error('Error loading settings:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    // Settings are already loaded in main.ts, just grab from window
    if (window._settings) {
      settings.value = window._settings
      loading.value = false
    } else {
      loadSettings()
    }
  })

  return {
    settings,
    loading,
    error,
    loadSettings
  }
}
