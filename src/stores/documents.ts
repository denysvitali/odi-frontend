import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Document } from '@/types/documents'

export const useDocumentStore = defineStore('documents', () => {
  // State
  const documents = ref<Document[]>([])
  const selectedDocument = ref<Document | null>(null)
  const recentSearches = ref<string[]>([])

  // Getters
  const documentCount = computed(() => documents.value.length)
  const hasSelectedDocument = computed(() => selectedDocument.value !== null)

  // Actions
  const setDocuments = (docs: Document[]) => {
    documents.value = docs
  }

  const addDocuments = (docs: Document[]) => {
    documents.value.push(...docs)
  }

  const selectDocument = (doc: Document | null) => {
    selectedDocument.value = doc
  }

  const clearSelection = () => {
    selectedDocument.value = null
  }

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return

    // Remove if already exists, then add to front
    const index = recentSearches.value.indexOf(term)
    if (index > -1) {
      recentSearches.value.splice(index, 1)
    }

    recentSearches.value.unshift(term)

    // Keep only last 10 searches
    if (recentSearches.value.length > 10) {
      recentSearches.value = recentSearches.value.slice(0, 10)
    }

    // Persist to localStorage
    localStorage.setItem('odi-recent-searches', JSON.stringify(recentSearches.value))
  }

  const loadRecentSearches = () => {
    const stored = localStorage.getItem('odi-recent-searches')
    if (stored) {
      try {
        recentSearches.value = JSON.parse(stored)
      } catch {
        recentSearches.value = []
      }
    }
  }

  const clearRecentSearches = () => {
    recentSearches.value = []
    localStorage.removeItem('odi-recent-searches')
  }

  return {
    // State
    documents,
    selectedDocument,
    recentSearches,

    // Getters
    documentCount,
    hasSelectedDocument,

    // Actions
    setDocuments,
    addDocuments,
    selectDocument,
    clearSelection,
    addRecentSearch,
    loadRecentSearches,
    clearRecentSearches
  }
})
