<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
</script>

<template>
  <Card class="overflow-hidden">
    <Skeleton class="aspect-[3/4] w-full rounded-none" />
    <CardContent class="space-y-3 p-4">
      <Skeleton class="h-4 w-1/3" />
      <Skeleton class="h-3 w-full" />
      <Skeleton class="h-3 w-2/3" />
    </CardContent>
  </Card>
</template>
