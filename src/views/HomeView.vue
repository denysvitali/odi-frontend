<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/search/SearchInput.vue'
import ResultsCounter from '@/components/search/ResultsCounter.vue'
import DocumentGrid from '@/components/documents/DocumentGrid.vue'
import DocumentDetailSheet from '@/components/documents/DocumentDetailSheet.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import { useSearch } from '@/composables/useSearch'
import { useDocumentStore } from '@/stores/documents'
import type { Document } from '@/types/documents'

const { searchTerm, results, loading, total, hasSearched, search } = useSearch({
  debounceMs: 300
})

const store = useDocumentStore()
const opensearchUrl = ref('')
const selectedDocument = ref<Document | null>(null)
const sheetOpen = ref(false)

const handleSelectDocument = (doc: Document) => {
  selectedDocument.value = doc
  sheetOpen.value = true
}

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    search(searchTerm.value)
    store.addRecentSearch(searchTerm.value)
  }
}

onMounted(() => {
  store.loadRecentSearches()
  if (window._settings?.opensearchUrl) {
    opensearchUrl.value = window._settings.opensearchUrl
  }
})
</script>

<template>
  <PageContainer
    :class="[
      'transition-all duration-500 ease-out',
      hasSearched ? 'pt-4' : 'pt-[20vh]'
    ]"
  >
    <!-- Hero Section -->
    <div class="mb-8 text-center">
      <div
        v-if="!hasSearched"
        class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
        <FileText class="h-8 w-8" />
      </div>

      <h1
        v-if="!hasSearched"
        class="mb-2 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        Search your documents
      </h1>

      <p
        v-if="!hasSearched"
        class="mb-8 text-muted-foreground"
      >
        Find what you're looking for across all your indexed documents
      </p>

      <!-- Search Input -->
      <SearchInput
        v-model="searchTerm"
        class="mx-auto max-w-2xl"
        @submit="handleSearch"
      />

      <!-- Recent Searches -->
      <div
        v-if="!hasSearched && store.recentSearches.length > 0"
        class="mt-6"
      >
        <p class="mb-3 text-sm text-muted-foreground">Recent searches</p>
        <div class="flex flex-wrap justify-center gap-2">
          <Button
            v-for="term in store.recentSearches.slice(0, 5)"
            :key="term"
            variant="secondary"
            size="sm"
            class="text-muted-foreground"
            @click="searchTerm = term; handleSearch()"
          >
            {{ term }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="hasSearched" class="space-y-6">
      <div class="flex items-center justify-between">
        <ResultsCounter :count="results.length" :total="total" :loading="loading" />
      </div>

      <DocumentGrid
        :documents="results"
        :loading="loading"
        :search-term="searchTerm"
        :opensearch-url="opensearchUrl"
        @select-document="handleSelectDocument"
      />
    </div>

    <!-- Document Detail Sheet -->
    <DocumentDetailSheet
      v-model:open="sheetOpen"
      :document="selectedDocument"
    />
  </PageContainer>
</template>
