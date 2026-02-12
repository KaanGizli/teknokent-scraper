<template>
  <aside class="app-sidebar">
    <!-- Brand -->
    <div class="sidebar-brand">
      <span class="sidebar-brand-icon">🎯</span>
      <div>
        <h1>TeknoHunter</h1>
        <span>Hayalindeki İşe Yaklaş</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        active-class="active"
      >
        <span class="sidebar-link-icon">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <p>🚀 v1.0.0 — Vue 3 + Express</p>
    </div>
  </aside>
</template>

<script setup>
const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/firmalar', icon: '🏢', label: 'Firmalar' },
  { to: '/scraper', icon: '⚡', label: 'Scraper' },
  { to: '/hakkinda', icon: 'ℹ️', label: 'Hakkında' }
]
</script>
