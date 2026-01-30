import { ref, computed } from 'vue'
import type { DocumentDetails } from '@/types/documents'

export function useDocumentDetails() {
  const details = ref<DocumentDetails | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiUrl = computed(() => window._settings?.apiUrl || '')

  const fetchDetails = async (documentId: string) => {
    if (loading.value) return

    loading.value = true
    error.value = null
    details.value = null

    try {
      const url = `${apiUrl.value}/documents/${encodeURIComponent(documentId)}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to load document details: ${response.statusText}`)
      }

      const data = await response.json()
      details.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load document details'
      console.error('Error loading document details:', err)
    } finally {
      loading.value = false
    }
  }

  const clearDetails = () => {
    details.value = null
    error.value = null
  }

  return {
    details,
    loading,
    error,
    fetchDetails,
    clearDetails
  }
}
