<script setup lang="ts">
import { inject } from 'vue'

const tooltip = inject<{
  show: () => void
  hide: () => void
  triggerRef: { value: HTMLElement | null }
}>('tooltip')
</script>

<template>
  <div
    ref="tooltip?.triggerRef"
    @mouseenter="tooltip?.show"
    @mouseleave="tooltip?.hide"
    @focus="tooltip?.show"
    @blur="tooltip?.hide"
    class="inline-flex"
  >
    <slot />
  </div>
</template>
