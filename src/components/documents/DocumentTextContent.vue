<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  text: string
}

const props = defineProps<Props>()

const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm text-muted-foreground">
        {{ text.length.toLocaleString() }} characters
      </span>
      <Button
        variant="outline"
        size="sm"
        @click="copyToClipboard"
      >
        <Check v-if="copied" class="mr-2 h-4 w-4 text-green-500" />
        <Copy v-else class="mr-2 h-4 w-4" />
        {{ copied ? 'Copied!' : 'Copy' }}
      </Button>
    </div>

    <ScrollArea class="h-[400px] rounded-md border bg-muted/30 p-4">
      <pre class="text-sm whitespace-pre-wrap font-mono">{{ text }}</pre>
    </ScrollArea>
  </div>
</template>
