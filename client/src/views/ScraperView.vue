<template>
  <div>
    <div class="page-header">
      <h2>⚡ Scraper Panel</h2>
      <p>Teknokent sitelerinden firma bilgilerini çekin</p>
    </div>

    <!-- Scraper Controls -->
    <div class="scraper-panel">
      <h3 style="margin-bottom: 20px; font-size: 18px;">🚀 Yeni Scraping Başlat</h3>
      <div class="scraper-controls">
        <div class="form-group" style="flex: 1; max-width: 300px;">
          <label>Teknokent Seçin</label>
          <select class="select w-full" v-model="selectedTeknokent">
            <option value="">— Teknokent seçin —</option>
            <option
              v-for="t in activeTeknokentler"
              :key="t.id"
              :value="t.id"
            >
              {{ t.name }} ({{ t.city }})
            </option>
          </select>
        </div>

        <button
          class="btn btn-success btn-lg"
          :disabled="!selectedTeknokent || scrapeStore.status === 'running'"
          @click="startScraping"
        >
          <span v-if="scrapeStore.status === 'running'" class="loading-spinner">
            <span class="spinner"></span>
            Çalışıyor...
          </span>
          <span v-else>🚀 Scraping Başlat</span>
        </button>
      </div>

      <!-- Live Status -->
      <div v-if="scrapeStore.status !== 'idle'" class="scrape-status">
        <div class="scrape-status-header">
          <span class="badge" :class="statusBadgeClass">
            {{ statusText }}
          </span>
          <span style="font-size: 13px; color: var(--text-muted);">
            {{ scrapeStore.current }} / {{ scrapeStore.total || '?' }}
          </span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <div class="scrape-status-message">
          {{ scrapeStore.message }}
        </div>
      </div>
    </div>

    <!-- Teknokent Cards -->
    <h3 style="margin-bottom: 16px; font-size: 18px;">🏛️ Desteklenen Teknokentler</h3>
    <div class="stats-grid" style="margin-bottom: 32px;">
      <div
        v-for="t in firmaStore.teknokentler"
        :key="t.id"
        class="stat-card"
        :class="t.active ? 'indigo' : ''"
      >
        <div class="stat-icon" :class="t.active ? 'indigo' : ''">
          🏢
        </div>
        <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">
          {{ t.name }}
        </div>
        <div class="stat-label">{{ t.city }}</div>
        <div style="margin-top: 12px;">
          <span v-if="t.scrapeSupported" class="badge badge-success">✓ Aktif</span>
          <span v-else class="badge badge-warning">⏳ Yakında</span>
        </div>
      </div>
    </div>

    <!-- Scrape History -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📋 Scrape Geçmişi</h3>
        <button class="btn btn-ghost btn-sm" @click="scrapeStore.fetchHistory">
          🔄 Yenile
        </button>
      </div>

      <div v-if="scrapeStore.history.length" class="history-list">
        <div
          v-for="item in scrapeStore.history"
          :key="item.id"
          class="history-item"
        >
          <span class="history-item-dot"></span>
          <span class="history-item-name">{{ item.teknokentName }}</span>
          <span class="history-item-count">{{ item.firmaCount }} firma</span>
          <span class="history-item-date">{{ formatDate(item.scrapedAt) }}</span>
        </div>
      </div>
      <div v-else class="empty-state" style="padding: 32px;">
        <p style="color: var(--text-muted);">Henüz scraping yapılmamış</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFirmaStore } from '../stores/firmaStore'
import { useScrapeStore } from '../stores/scrapeStore'

const firmaStore = useFirmaStore()
const scrapeStore = useScrapeStore()

const selectedTeknokent = ref('')

onMounted(() => {
  firmaStore.fetchTeknokentler()
  scrapeStore.fetchHistory()
})

onUnmounted(() => {
  scrapeStore.stopPolling()
})

const activeTeknokentler = computed(() => {
  return firmaStore.teknokentler.filter(t => t.active && t.scrapeSupported)
})

const progressPercent = computed(() => {
  if (!scrapeStore.total) return 0
  return Math.round((scrapeStore.current / scrapeStore.total) * 100)
})

const statusText = computed(() => {
  switch (scrapeStore.status) {
    case 'running': return '⏳ Çalışıyor'
    case 'completed': return '✅ Tamamlandı'
    case 'error': return '❌ Hata'
    default: return '💤 Bekliyor'
  }
})

const statusBadgeClass = computed(() => {
  switch (scrapeStore.status) {
    case 'running': return 'badge-warning'
    case 'completed': return 'badge-success'
    case 'error': return 'badge-danger'
    default: return 'badge-primary'
  }
})

async function startScraping() {
  if (!selectedTeknokent.value) return
  await scrapeStore.startScrape(selectedTeknokent.value)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
