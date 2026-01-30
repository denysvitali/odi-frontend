<script setup lang="ts">
import { computed, watch } from 'vue'
import { Calendar, Building2, FileText, QrCode, AlertCircle, ExternalLink } from 'lucide-vue-next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import DocumentDetailSection from './DocumentDetailSection.vue'
import DocumentCompanyCard from './DocumentCompanyCard.vue'
import DocumentBarcodeCard from './DocumentBarcodeCard.vue'
import DocumentTextContent from './DocumentTextContent.vue'
import DocumentDetailSkeleton from './DocumentDetailSkeleton.vue'
import { useDocumentDetails } from '@/composables/useDocumentDetails'
import type { Document } from '@/types/documents'

interface Props {
  document: Document | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { details, loading, error, fetchDetails, clearDetails } = useDocumentDetails()

const thumbnailUrl = computed(() => {
  if (!props.document) return ''
  const baseUrl = window._settings?.apiUrl || ''
  return `${baseUrl}/thumbnails/${encodeURIComponent(props.document._id)}`
})

const fullImageUrl = computed(() => {
  if (!props.document) return ''
  const baseUrl = window._settings?.apiUrl || ''
  return `${baseUrl}/files/${encodeURIComponent(props.document._id).replace(/_/g, '/')}`
})

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('de-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateStr
  }
}

const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('de-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return dateStr
  }
}

const hasBarcodes = computed(() => {
  return details.value?.barcodes && details.value.barcodes.length > 0
})

// Fetch details when document changes
watch(() => props.document, (newDoc) => {
  if (newDoc) {
    fetchDetails(newDoc._id)
  } else {
    clearDetails()
  }
}, { immediate: true })

const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) {
    clearDetails()
  }
}

const openFullImage = () => {
  window.open(fullImageUrl.value, '_blank')
}
</script>

<template>
  <Sheet :open="open" @update:open="handleOpenChange">
    <SheetContent class="w-full sm:max-w-lg overflow-hidden flex flex-col">
      <SheetHeader class="shrink-0">
        <SheetTitle>Document Details</SheetTitle>
        <SheetDescription v-if="document" class="font-mono text-xs truncate">
          {{ document._id }}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea class="flex-1 -mx-6 px-6">
        <!-- Loading State -->
        <div v-if="loading" class="py-6">
          <DocumentDetailSkeleton />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-6">
          <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <AlertCircle class="mx-auto h-8 w-8 text-destructive mb-2" />
            <p class="text-sm text-destructive">{{ error }}</p>
            <Button
              variant="outline"
              size="sm"
              class="mt-3"
              @click="document && fetchDetails(document._id)"
            >
              Try Again
            </Button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="details" class="space-y-6 py-6">
          <!-- Thumbnail -->
          <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted cursor-pointer group" @click="openFullImage">
            <img
              :src="thumbnailUrl"
              :alt="`Document ${document?._id}`"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <Button variant="secondary" size="sm">
                <ExternalLink class="mr-2 h-4 w-4" />
                View Full Image
              </Button>
            </div>
          </div>

          <!-- Tabs -->
          <Tabs default-value="info" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <FileText class="mr-2 h-4 w-4" />
                Info
              </TabsTrigger>
              <TabsTrigger value="text">
                <FileText class="mr-2 h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="barcodes" :disabled="!hasBarcodes">
                <QrCode class="mr-2 h-4 w-4" />
                Barcodes
                <Badge v-if="hasBarcodes" variant="secondary" class="ml-2 text-xs">
                  {{ details.barcodes!.length }}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <!-- Info Tab -->
            <TabsContent value="info" class="space-y-6 pt-4">
              <!-- Dates Section -->
              <DocumentDetailSection title="Dates" :icon="Calendar">
                <div class="space-y-3">
                  <div v-if="details.primaryDate" class="space-y-1">
                    <p class="text-xs text-muted-foreground">Primary Date</p>
                    <p class="font-medium">{{ formatDate(details.primaryDate) }}</p>
                  </div>

                  <div v-if="details.dates && details.dates.length > 0" class="space-y-1">
                    <p class="text-xs text-muted-foreground">All Dates Found</p>
                    <div class="flex flex-wrap gap-2">
                      <Badge
                        v-for="date in details.dates"
                        :key="date"
                        variant="outline"
                      >
                        {{ formatDate(date) }}
                      </Badge>
                    </div>
                  </div>

                  <div v-if="details.indexedAt" class="space-y-1">
                    <p class="text-xs text-muted-foreground">Indexed At</p>
                    <p class="text-sm text-muted-foreground">{{ formatDateTime(details.indexedAt) }}</p>
                  </div>
                </div>
              </DocumentDetailSection>

              <Separator />

              <!-- Company Section -->
              <DocumentDetailSection title="Company" :icon="Building2">
                <template v-if="details.company">
                  <DocumentCompanyCard :company="details.company" />
                </template>
                <p v-else class="text-sm text-muted-foreground">
                  No company information available
                </p>
              </DocumentDetailSection>
            </TabsContent>

            <!-- Text Tab -->
            <TabsContent value="text" class="pt-4">
              <template v-if="details.text">
                <DocumentTextContent :text="details.text" />
              </template>
              <p v-else class="text-sm text-muted-foreground">
                No text content available
              </p>
            </TabsContent>

            <!-- Barcodes Tab -->
            <TabsContent value="barcodes" class="space-y-4 pt-4">
              <template v-if="hasBarcodes">
                <DocumentBarcodeCard
                  v-for="(barcode, index) in details.barcodes"
                  :key="index"
                  :barcode="barcode"
                />
              </template>
              <p v-else class="text-sm text-muted-foreground">
                No barcodes found in this document
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <!-- Empty State -->
        <div v-else class="py-6 text-center text-muted-foreground">
          Select a document to view details
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
