<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="space-y-6">
    <!-- Thumbnail skeleton -->
    <Skeleton class="w-full aspect-[3/4] rounded-lg" />

    <!-- Tabs skeleton -->
    <Skeleton class="h-10 w-full rounded-md" />

    <!-- Content skeleton -->
    <div class="space-y-4">
      <div class="space-y-2">
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-6 w-32" />
      </div>

      <div class="space-y-2">
        <Skeleton class="h-4 w-24" />
        <div class="flex gap-2">
          <Skeleton class="h-6 w-20" />
          <Skeleton class="h-6 w-20" />
          <Skeleton class="h-6 w-20" />
        </div>
      </div>

      <div class="space-y-2">
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-24 w-full rounded-lg" />
      </div>
    </div>
  </div>
</template>
