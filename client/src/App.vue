<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="app-main">
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="slide-up">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', toast.type]"
          @click="removeToast(toast.id)"
        >
          <span>{{ toast.text }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useScrapeStore } from './stores/scrapeStore'
import AppSidebar from './components/AppSidebar.vue'

const scrapeStore = useScrapeStore()
const toasts = computed(() => scrapeStore.toasts)
const removeToast = (id) => scrapeStore.removeToast(id)
</script>
