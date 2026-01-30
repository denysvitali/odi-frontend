import { ref, computed, onMounted, watchEffect } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('system')
const isDark = ref(false)

export function useTheme() {
  const effectiveTheme = computed<Exclude<Theme, 'system'>>(() => {
    if (theme.value === 'system') {
      return isDark.value ? 'dark' : 'light'
    }
    return theme.value
  })

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('odi-theme', newTheme)
    updateDocumentClass()
  }

  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const updateDocumentClass = () => {
    const root = document.documentElement
    if (effectiveTheme.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
    isDark.value = e.matches
    updateDocumentClass()
  }

  onMounted(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('odi-theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    isDark.value = mediaQuery.matches

    mediaQuery.addEventListener('change', handleMediaQuery)
    updateDocumentClass()

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQuery)
    }
  })

  // Re-apply class when theme changes
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      updateDocumentClass()
    }
  })

  return {
    theme,
    effectiveTheme,
    isDark: computed(() => effectiveTheme.value === 'dark'),
    setTheme,
    toggleTheme
  }
}
