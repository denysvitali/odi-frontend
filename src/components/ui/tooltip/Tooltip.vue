<script setup lang="ts">
import { ref, provide, readonly } from 'vue'

const props = defineProps<{
  delay?: number
}>()

const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const delay = props.delay ?? 200

const show = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  if (!isVisible.value) {
    showTimeout = setTimeout(() => {
      isVisible.value = true
    }, delay)
  }
}

const hide = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

provide('tooltip', {
  isVisible: readonly(isVisible),
  triggerRef,
  contentRef,
  show,
  hide
})
</script>

<template>
  <div class="relative inline-flex">
    <slot />
  </div>
</template>
