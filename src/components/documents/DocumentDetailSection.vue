<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  icon?: Component
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-sm font-medium text-foreground">
      <component :is="icon" v-if="icon" class="h-4 w-4 text-muted-foreground" />
      {{ title }}
    </div>
    <slot />
  </div>
</template>
