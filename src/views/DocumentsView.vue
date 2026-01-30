<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DocumentGrid from '@/components/documents/DocumentGrid.vue'
import DocumentDetailSheet from '@/components/documents/DocumentDetailSheet.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import { useDocuments } from '@/composables/useDocuments'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import type { Document } from '@/types/documents'

const {
  documents,
  loading,
  loadingMore,
  error,
  total,
  hasMore,
  loadDocuments,
  loadMore,
  refresh
} = useDocuments({ initialPageSize: 12 })

const opensearchUrl = ref('')
const selectedDocument = ref<Document | null>(null)
const sheetOpen = ref(false)

const handleSelectDocument = (doc: Document) => {
  selectedDocument.value = doc
  sheetOpen.value = true
}

// Set up infinite scroll
const { targetRef } = useInfiniteScroll(() => {
  if (!loading.value && !loadingMore.value && hasMore.value) {
    loadMore()
  }
})

onMounted(() => {
  loadDocuments()
  if (window._settings?.opensearchUrl) {
    opensearchUrl.value = window._settings.opensearchUrl
  }
})
</script>

<template>
  <PageContainer>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Documents</h1>
          <p class="text-muted-foreground">
            Browse all indexed documents
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          :disabled="loading"
          @click="refresh"
        >
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </Button>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive"
      >
        <p>{{ error }}</p>
        <Button
          variant="outline"
          size="sm"
          class="mt-2"
          @click="refresh"
        >
          Try Again
        </Button>
      </div>

      <!-- Results Counter -->
      <div v-if="!error" class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          <span v-if="loading" class="flex items-center gap-2">
            <div class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading documents...
          </span>
          <span v-else-if="total > 0">
            {{ total.toLocaleString() }} document{{ total !== 1 ? 's' : '' }} indexed
          </span>
          <span v-else>No documents found</span>
        </div>
      </div>

      <!-- Document Grid -->
      <DocumentGrid
        :documents="documents"
        :loading="loading"
        :loading-more="loadingMore"
        :has-more="hasMore"
        :opensearch-url="opensearchUrl"
        @load-more="loadMore"
        @select-document="handleSelectDocument"
      />

      <!-- Infinite Scroll Trigger -->
      <div ref="targetRef" class="h-4" />
    </div>

    <!-- Document Detail Sheet -->
    <DocumentDetailSheet
      v-model:open="sheetOpen"
      :document="selectedDocument"
    />
  </PageContainer>
</template>
