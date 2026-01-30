<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

import type { ClassValue } from 'clsx'

interface Props {
  class?: ClassValue
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false
})

const classes = computed(() =>
  cn(
    'mx-auto w-full',
    props.fullWidth ? 'max-w-none' : 'max-w-7xl',
    'px-4 sm:px-6 lg:px-8',
    props.class
  )
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
