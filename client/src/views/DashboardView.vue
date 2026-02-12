<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <h2>
        Teknokent Firmalarını <span class="gradient-text">Keşfet</span>
      </h2>
      <p>
        Türkiye'nin önde gelen üniversite teknokentlerindeki firmaları tek platformdan görüntüle,
        analiz et ve iş başvurularında öne çık.
      </p>
      <div class="slogan">
        🎯 Hayalindeki İşe Bir Adım Daha Yakın
      </div>
    </section>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card indigo">
        <div class="stat-icon indigo">🏢</div>
        <div class="stat-value">{{ stats?.totalFirmalar || 0 }}</div>
        <div class="stat-label">Toplam Firma</div>
      </div>

      <div class="stat-card green">
        <div class="stat-icon green">🏛️</div>
        <div class="stat-value">{{ stats?.totalTeknokent || 0 }}</div>
        <div class="stat-label">Teknokent</div>
      </div>

      <div class="stat-card pink">
        <div class="stat-icon pink">🌐</div>
        <div class="stat-value">{{ stats?.withWebsite || 0 }}</div>
        <div class="stat-label">Web Sitesi Olan</div>
      </div>

      <div class="stat-card cyan">
        <div class="stat-icon cyan">📅</div>
        <div class="stat-value">{{ lastUpdateText }}</div>
        <div class="stat-label">Son Güncelleme</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <div class="chart-card">
        <h3>📊 Teknokent Dağılımı</h3>
        <div v-if="hasChartData" style="height: 300px;">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
        <div v-else class="empty-state">
          <div class="empty-state-icon">📊</div>
          <h3>Veri Yok</h3>
          <p>Henüz scraping yapılmamış. Scraper sayfasından veri çekmeye başlayın!</p>
          <router-link to="/scraper" class="btn btn-primary">
            ⚡ Scraper'a Git
          </router-link>
        </div>
      </div>

      <div class="chart-card">
        <h3>📈 Son Scrape Geçmişi</h3>
        <div v-if="recentScrapes.length" class="history-list">
          <div
            v-for="item in recentScrapes"
            :key="item.id"
            class="history-item"
          >
            <span class="history-item-dot"></span>
            <span class="history-item-name">{{ item.teknokentName }}</span>
            <span class="history-item-count">{{ item.firmaCount }} firma</span>
            <span class="history-item-date">{{ formatDate(item.scrapedAt) }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>Geçmiş Yok</h3>
          <p>Henüz scraping yapılmamış.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFirmaStore } from '../stores/firmaStore'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useFirmaStore()

onMounted(() => {
  store.fetchStats()
})

const stats = computed(() => store.stats)
const recentScrapes = computed(() => stats.value?.recentScrapes || [])

const lastUpdateText = computed(() => {
  if (!stats.value?.lastUpdated) return '—'
  const d = new Date(stats.value.lastUpdated)
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
})

const hasChartData = computed(() => {
  return stats.value?.teknokentDistribution &&
    Object.keys(stats.value.teknokentDistribution).length > 0
})

const chartColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4',
  '#22c55e', '#f59e0b', '#ef4444', '#a78bfa'
]

const chartData = computed(() => {
  if (!hasChartData.value) return { labels: [], datasets: [] }
  const dist = stats.value.teknokentDistribution
  return {
    labels: Object.keys(dist),
    datasets: [{
      data: Object.values(dist),
      backgroundColor: chartColors.slice(0, Object.keys(dist).length),
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 8
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 10
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'Inter' }
    }
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
