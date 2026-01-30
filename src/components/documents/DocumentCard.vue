<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, Calendar, Building2 } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import type { Document } from '@/types/documents'

interface Props {
  document: Document
  searchTerm?: string
  opensearchUrl?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [document: Document]
}>()

const docUrl = computed(() => {
  if (!props.opensearchUrl) return '#'
  return `${props.opensearchUrl}/app/discover#/doc/*/odi-*?id=${encodeURIComponent(props.document._id)}`
})

const thumbnailUrl = computed(() => {
  const baseUrl = window._settings?.apiUrl || ''
  return `${baseUrl}/thumbnails/${encodeURIComponent(props.document._id)}`
})

const fullImageUrl = computed(() => {
  const baseUrl = window._settings?.apiUrl || ''
  return `${baseUrl}/files/${encodeURIComponent(props.document._id).replace(/_/g, '/')}`
})

const highlightedText = computed(() => {
  const text = props.document.highlight?.text?.[0] || props.document._source.text || ''
  // Don't truncate - show full text, but clean it up
  return text
})

const companyName = computed(() => props.document._source.company?.name)

const formatDocId = (id: string) => {
  // Extract date from ID if possible (format: YYYY-MM-...)
  const match = id.match(/^(\d{4}-\d{2})/)
  if (match) {
    const [year, month] = match[1].split('-')
    return `${month}/${year}`
  }
  return id.slice(0, 10)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

const openDocument = () => {
  window.open(fullImageUrl.value, '_blank')
}

const openInOpensearch = () => {
  window.open(docUrl.value, '_blank')
}

const handleCardClick = () => {
  emit('select', props.document)
}
</script>

<template>
  <Card class="group overflow-hidden hover-lift cursor-pointer border-border/50" @click="handleCardClick">
    <!-- Thumbnail -->
    <div class="relative aspect-[3/4] overflow-hidden bg-muted">
      <img
        :src="thumbnailUrl"
        :alt="`Document ${document._id}`"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Hover overlay with actions -->
      <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="icon"
              class="scale-90 transition-transform duration-200 hover:scale-100"
              @click.stop="openDocument"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Document</TooltipContent>
        </Tooltip>

        <Tooltip v-if="opensearchUrl">
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="icon"
              class="scale-90 transition-transform duration-200 hover:scale-100"
              @click.stop="openInOpensearch"
            >
              <ExternalLink class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in OpenSearch</TooltipContent>
        </Tooltip>
      </div>

      <!-- Company badge -->
      <div class="absolute bottom-3 left-3">
        <Badge v-if="companyName" variant="secondary" class="glass text-xs"
        >
          <Building2 class="mr-1 h-3 w-3" />
          {{ companyName }}
        </Badge>
      </div>
    </div>

    <!-- Content -->
    <CardContent class="p-4">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar class="h-3 w-3" />
        <span>{{ formatDocId(document._id) }}</span>
      </div>

      <div
        v-if="highlightedText"
        class="mt-2 line-clamp-3 text-sm text-muted-foreground"
        v-html="highlightedText"
      />
    </CardContent>
  </Card>
</template>
