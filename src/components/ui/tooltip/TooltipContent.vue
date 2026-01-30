<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  side: 'top'
})

const tooltip = inject<{
  isVisible: { value: boolean }
  contentRef: { value: HTMLElement | null }
}>('tooltip')

const classes = computed(() =>
  cn(
    'absolute z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md',
    'transition-all duration-200 ease-out',
    tooltip?.isVisible.value ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
    props.side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    props.side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
    props.side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
    props.side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
    props.class
  )
)
</script>

<template>
  <div
    v-if="tooltip?.isVisible.value"
    ref="tooltip?.contentRef"
    :class="classes"
    role="tooltip"
  >
    <slot />
  </div>
</template>
