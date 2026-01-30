<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const modelValue = defineModel<string>()

const emit = defineEmits<{
  submit: []
}>()

const inputRef = ref<HTMLInputElement>()

const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K to focus
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

const handleSubmit = () => {
  if (modelValue.value?.trim()) {
    emit('submit')
  }
}

const clearSearch = () => {
  modelValue.value = ''
  inputRef.value?.focus()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="relative">
      <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <Input
        ref="inputRef"
        v-model="modelValue"
        type="text"
        placeholder="Search documents..."
        class="h-14 w-full rounded-2xl border-border/50 bg-secondary/50 pl-12 pr-24 text-base shadow-sm transition-all duration-200 focus:bg-background focus:shadow-md"
        @keyup.enter="handleSubmit"
      />

      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Button
          v-if="modelValue"
          variant="ghost"
          size="icon"
          class="h-8 w-8 text-muted-foreground hover:text-foreground"
          @click="clearSearch"
        >
          <X class="h-4 w-4" />
        </Button>

        <kbd
          class="hidden sm:inline-flex h-8 items-center gap-1 rounded-lg border bg-muted px-2.5 text-xs font-medium text-muted-foreground"
        >
          <span class="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  </div>
</template>
