<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader />

    <div class="flex">
      <AppSidebar />

      <main class="flex-1 lg:ml-64">
        <div class="p-4 lg:p-8">
          <RouterView v-slot="{ Component }">
            <Transition
              name="page"
              mode="out-in"
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 translate-y-2"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
