<template>
  <div>
    <div class="page-header">
      <h2>ℹ️ Hakkında</h2>
      <p>TeknoHunter projesi hakkında bilgi</p>
    </div>

    <!-- Project Info -->
    <div class="hero" style="margin-bottom: 32px;">
      <h2>
        <span class="gradient-text">TeknoHunter</span>
      </h2>
      <p style="font-size: 18px; margin-bottom: 8px;">
        Hayalindeki İşe Bir Adım Daha Yakın 🎯
      </p>
      <p>
        TeknoHunter, Türkiye'deki üniversite teknokentlerinde faaliyet gösteren firmaların
        bilgilerini otomatik olarak toplayan ve analiz eden bir web platformudur.
        İş arayan öğrenciler ve yeni mezunlar için teknokent firmalarına kolay erişim sağlar.
      </p>
    </div>

    <!-- How it works -->
    <div class="charts-grid">
      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">🔄 Nasıl Çalışır?</h3>
        <div class="history-list">
          <div class="history-item">
            <span class="history-item-dot" style="background: #6366f1;"></span>
            <span><strong>1.</strong> Teknokent web sitelerinden firma bilgileri otomatik olarak çekilir</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #8b5cf6;"></span>
            <span><strong>2.</strong> Firma adı ve web sitesi bilgileri veritabanına kaydedilir</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #ec4899;"></span>
            <span><strong>3.</strong> Dashboard'dan istatistikleri, dağılımı ve trendleri görüntüleyin</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #06b6d4;"></span>
            <span><strong>4.</strong> Firmalar sayfasından arayın, filtreleyin ve Excel'e aktarın</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #22c55e;"></span>
            <span><strong>5.</strong> Excel dosyasını indirip iş başvurularında kullanın!</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">🛠️ Teknolojiler</h3>
        <div class="history-list">
          <div class="history-item">
            <span class="history-item-dot" style="background: #22c55e;"></span>
            <span class="history-item-name">Vue 3</span>
            <span class="badge badge-success">Frontend</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #22c55e;"></span>
            <span class="history-item-name">Pinia</span>
            <span class="badge badge-success">State Management</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #22c55e;"></span>
            <span class="history-item-name">Vue Router</span>
            <span class="badge badge-success">Routing</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #6366f1;"></span>
            <span class="history-item-name">Node.js + Express</span>
            <span class="badge badge-primary">Backend</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #6366f1;"></span>
            <span class="history-item-name">RESTful API</span>
            <span class="badge badge-primary">API Design</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #f59e0b;"></span>
            <span class="history-item-name">Axios + Cheerio</span>
            <span class="badge badge-warning">Scraping</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #f59e0b;"></span>
            <span class="history-item-name">Chart.js</span>
            <span class="badge badge-warning">Visualization</span>
          </div>
          <div class="history-item">
            <span class="history-item-dot" style="background: #f59e0b;"></span>
            <span class="history-item-name">ExcelJS</span>
            <span class="badge badge-warning">Export</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Supported Teknokents -->
    <div class="card" style="margin-top: 24px;">
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">🏛️ Desteklenen Teknokentler</h3>
      <div class="stats-grid">
        <div class="stat-card indigo">
          <div class="stat-icon indigo">🎓</div>
          <div style="font-size: 16px; font-weight: 700;">Hacettepe Teknokent</div>
          <div class="stat-label">Ankara</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon green">🎓</div>
          <div style="font-size: 16px; font-weight: 700;">ODTÜ Teknokent</div>
          <div class="stat-label">Ankara</div>
        </div>
        <div class="stat-card pink">
          <div class="stat-icon pink">🎓</div>
          <div style="font-size: 16px; font-weight: 700;">Ankara Teknokent</div>
          <div class="stat-label">Ankara</div>
        </div>
        <div class="stat-card cyan">
          <div class="stat-icon cyan">🎓</div>
          <div style="font-size: 16px; font-weight: 700;">Mersin Üniversitesi Teknokent</div>
          <div class="stat-label">Mersin</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
