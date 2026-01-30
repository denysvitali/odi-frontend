<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, FileText, Settings, HelpCircle } from 'lucide-vue-next'

const router = useRouter()

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Documents', path: '/documents', icon: FileText }
]

const footerItems = [
  { name: 'Settings', path: '#', icon: Settings },
  { name: 'Help', path: '#', icon: HelpCircle }
]

const isActive = (path: string) => router.currentRoute.value.path === path
</script>

<template>
  <aside class="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col glass lg:flex">
    <nav class="flex-1 overflow-auto p-4">
      <div class="space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          ]"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
          <span
            v-if="isActive(item.path)"
            class="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
          />
        </RouterLink>
      </div>

      <div class="mt-8">
        <h3 class="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div class="mt-2 space-y-1">
          <button
            class="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Documents
            <kbd class="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground xl:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </nav>

    <div class="border-t border-border p-4">
      <div class="space-y-1">
        <a
          v-for="item in footerItems"
          :key="item.name"
          :href="item.path"
          class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
        </a>
      </div>
    </div>
  </aside>
</template>
