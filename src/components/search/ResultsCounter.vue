<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  count: number
  total?: number
  loading?: boolean
}

const props = defineProps<Props>()

const text = computed(() => {
  if (props.loading) {
    return 'Searching...'
  }

  if (props.count === 0) {
    return 'No results found'
  }

  if (props.total && props.total > props.count) {
    return `Showing ${props.count.toLocaleString()} of ${props.total.toLocaleString()} results`
  }

  return `${props.count.toLocaleString()} result${props.count !== 1 ? 's' : ''}`
})
</script>

<template>
  <div class="text-sm text-muted-foreground">
    <template v-if="loading">
      <div class="flex items-center gap-2">
        <div
          class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        {{ text }}
      </div>
    </template>
    <template v-else>
      {{ text }}
    </template>
  </div>
</template>
