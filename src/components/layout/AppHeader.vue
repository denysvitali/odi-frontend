<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X, FileText, Home } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { toggleTheme, isDark } = useTheme()
const mobileMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Documents', path: '/documents', icon: FileText }
]

const isActive = (path: string) => router.currentRoute.value.path === path
</script>

<template>
  <header class="sticky top-0 z-50 w-full glass">
    <div class="flex h-16 items-center justify-between px-4 lg:px-8">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="lg:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText class="h-4 w-4" />
          </div>
          <span class="text-lg font-semibold tracking-tight">ODI</span>
        </RouterLink>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
          :class="[
            isActive(item.path)
              ? 'text-foreground bg-secondary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          ]"
        >
          <span class="flex items-center gap-2">
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </span>
          <span
            v-if="isActive(item.path)"
            class="absolute inset-0 rounded-lg bg-secondary -z-10"
          />
        </RouterLink>
      </nav>

      <!-- Right side actions -->
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          @click="toggleTheme"
          class="text-muted-foreground"
        >
          <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </Button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div
      v-show="mobileMenuOpen"
      class="lg:hidden border-t border-border"
    >
      <nav class="flex flex-col p-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="[
            isActive(item.path)
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          ]"
          @click="mobileMenuOpen = false"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
