<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, Building2, MapPin, Tag } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Company } from '@/types/documents'

interface Props {
  company: Company
}

const props = defineProps<Props>()

const zefixUrl = computed(() => {
  if (!props.company.uri) return null
  return `https://www.zefix.ch/de/search/entity/list?name=${encodeURIComponent(props.company.name)}`
})

const isPrimary = computed(() => props.company.type === 'primary')
</script>

<template>
  <Card class="border-border/50">
    <CardContent class="p-4 space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ company.name }}</span>
            <Badge v-if="isPrimary" variant="secondary" class="text-xs">
              Primary
            </Badge>
          </div>
          <p v-if="company.legalName && company.legalName !== company.name" class="text-sm text-muted-foreground">
            {{ company.legalName }}
          </p>
        </div>
      </div>

      <div v-if="company.locality || company.address" class="flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin class="h-4 w-4 mt-0.5 shrink-0" />
        <span>{{ company.address || company.locality }}</span>
      </div>

      <div v-if="company.type && !isPrimary" class="flex items-center gap-2 text-sm text-muted-foreground">
        <Tag class="h-4 w-4 shrink-0" />
        <span>{{ company.type }}</span>
      </div>

      <Button
        v-if="zefixUrl"
        variant="outline"
        size="sm"
        class="w-full mt-2"
        as="a"
        :href="zefixUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Building2 class="mr-2 h-4 w-4" />
        View in Zefix
        <ExternalLink class="ml-auto h-3 w-3" />
      </Button>
    </CardContent>
  </Card>
</template>
