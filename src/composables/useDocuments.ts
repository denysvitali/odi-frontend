import { ref, computed } from 'vue'
import type { Document, SearchResult } from '@/types/documents'

export interface UseDocumentsOptions {
  initialPageSize?: number
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { initialPageSize = 12 } = options

  const documents = ref<Document[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const scrollId = ref<string | null>(null)
  const total = ref<number>(0)
  const pageSize = ref(initialPageSize)

  const hasMore = computed(() => {
    if (total.value === 0) return false
    return documents.value.length < total.value
  })

  const apiUrl = computed(() => window._settings?.apiUrl || '')

  const loadDocuments = async () => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const url = new URL(`${apiUrl.value}/documents`)
      url.searchParams.set('size', String(pageSize.value))

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`Failed to load documents: ${response.statusText}`)
      }

      const data: SearchResult<Document> = await response.json()

      if (data.hits) {
        documents.value = data.hits.hits
        total.value = data.hits.total?.value || 0
        scrollId.value = data._scroll_id || null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load documents'
      console.error('Error loading documents:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (loadingMore.value || !scrollId.value) return

    loadingMore.value = true

    try {
      const url = new URL(`${apiUrl.value}/documents`)
      url.searchParams.set('scroll_id', scrollId.value)
      url.searchParams.set('size', String(pageSize.value))

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`Failed to load more documents: ${response.statusText}`)
      }

      const data: SearchResult<Document> = await response.json()

      if (data.hits?.hits) {
        documents.value.push(...data.hits.hits)
        scrollId.value = data._scroll_id || null
      }
    } catch (err) {
      console.error('Error loading more documents:', err)
    } finally {
      loadingMore.value = false
    }
  }

  const refresh = () => {
    scrollId.value = null
    documents.value = []
    total.value = 0
    return loadDocuments()
  }

  return {
    documents,
    loading,
    loadingMore,
    error,
    total,
    hasMore,
    loadDocuments,
    loadMore,
    refresh
  }
}
