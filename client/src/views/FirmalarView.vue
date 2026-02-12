<template>
  <div>
    <div class="page-header">
      <h2>🏢 Firmalar</h2>
      <p>Tüm teknokentlerdeki firmaları görüntüleyin, arayın ve filtreleyin</p>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="input-group" style="flex: 1; max-width: 400px;">
        <span class="input-icon">🔍</span>
        <input
          class="input-search"
          type="text"
          placeholder="Firma adı veya web sitesi ara..."
          :value="store.search"
          @input="onSearch($event.target.value)"
        />
      </div>

      <select
        class="select"
        :value="store.selectedTeknokent"
        @change="store.setTeknokentFilter($event.target.value)"
      >
        <option value="">Tüm Teknokentler</option>
        <option
          v-for="t in store.teknokentler"
          :key="t.id"
          :value="t.id"
        >
          {{ t.name }}
        </option>
      </select>

      <select
        class="select"
        :value="store.sortBy"
        @change="store.setSort($event.target.value)"
      >
        <option value="date">Tarihe Göre</option>
        <option value="name">İsme Göre</option>
        <option value="teknokent">Teknokente Göre</option>
      </select>

      <div class="toolbar-spacer"></div>

      <div class="view-toggle">
        <button :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">▦</button>
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">☰</button>
      </div>

      <button class="btn btn-primary btn-sm" @click="handleExport" :disabled="store.total === 0">
        📥 Excel'e Aktar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="loading-page">
      <div class="spinner"></div>
      <p>Firmalar yükleniyor...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.firmalar.length === 0" class="empty-state">
      <div class="empty-state-icon">🏢</div>
      <h3>Henüz Firma Yok</h3>
      <p>Scraper sayfasından teknokent firmalarını çekmeye başlayın veya arama kriterlerini değiştirin.</p>
      <router-link to="/scraper" class="btn btn-primary">
        ⚡ Scraper'a Git
      </router-link>
    </div>

    <!-- Card View -->
    <div v-else-if="viewMode === 'card'" class="firma-grid">
      <div v-for="firma in store.firmalar" :key="firma.id" class="firma-card">
        <div class="firma-card-name">{{ firma.name }}</div>
        <a
          v-if="firma.website && firma.website !== '—'"
          :href="firma.website"
          target="_blank"
          rel="noopener"
          class="firma-card-website"
        >
          🌐 {{ cleanUrl(firma.website) }}
        </a>
        <span v-else class="firma-card-website" style="color: var(--text-muted);">
          Web sitesi yok
        </span>
        <div class="firma-card-footer">
          <span class="badge badge-primary">{{ firma.teknokentName }}</span>
          <span style="font-size: 12px; color: var(--text-muted);">
            {{ formatDate(firma.scrapedAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Firma Adı</th>
            <th>Web Sitesi</th>
            <th>Teknokent</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="firma in store.firmalar" :key="firma.id">
            <td style="font-weight: 600;">{{ firma.name }}</td>
            <td>
              <a
                v-if="firma.website && firma.website !== '—'"
                :href="firma.website"
                target="_blank"
                rel="noopener"
                style="color: var(--primary-400);"
              >
                {{ cleanUrl(firma.website) }}
              </a>
              <span v-else style="color: var(--text-muted);">—</span>
            </td>
            <td>
              <span class="badge badge-primary">{{ firma.teknokentName }}</span>
            </td>
            <td style="color: var(--text-muted); font-size: 13px;">
              {{ formatDate(firma.scrapedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="store.totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="store.page === 1"
        @click="store.setPage(store.page - 1)"
      >
        ‹
      </button>

      <button
        v-for="p in visiblePages"
        :key="p"
        :class="['pagination-btn', { active: p === store.page }]"
        @click="store.setPage(p)"
      >
        {{ p }}
      </button>

      <span class="pagination-info">
        {{ store.total }} firma
      </span>

      <button
        class="pagination-btn"
        :disabled="store.page === store.totalPages"
        @click="store.setPage(store.page + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFirmaStore } from '../stores/firmaStore'
import { useScrapeStore } from '../stores/scrapeStore'

const store = useFirmaStore()
const scrapeStore = useScrapeStore()
const viewMode = ref('card')

let debounceTimer = null

onMounted(() => {
  store.fetchFirmalar()
  store.fetchTeknokentler()
})

function onSearch(val) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setSearch(val)
  }, 300)
}

async function handleExport() {
  const ok = await store.exportExcel()
  if (ok) {
    scrapeStore.addToast('📥 Excel dosyası indirildi!', 'success')
  } else {
    scrapeStore.addToast('❌ Excel export başarısız', 'error')
  }
}

const visiblePages = computed(() => {
  const pages = []
  const total = store.totalPages
  const current = store.page
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function cleanUrl(url) {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}
</script>
