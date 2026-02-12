# 🎯 TeknoHunter

> **Hayalindeki İşe Bir Adım Daha Yakın**

Türkiye'deki üniversite teknokentlerinde faaliyet gösteren firmaların bilgilerini otomatik olarak toplayan ve analiz eden full-stack web platformu.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js_3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🚀 Özellikler

- **🔍 Otomatik Scraping** — Teknokent sitelerinden firma bilgilerini otomatik çeker
- **📊 Dashboard** — İstatistikler ve grafiklerle veri görselleştirme
- **🏢 Firma Listesi** — Arama, filtreleme, sıralama ve çift görünüm (kart/tablo)
- **📥 Excel Export** — Firma verilerini styled Excel dosyası olarak indir
- **⚡ Canlı Progress** — Scraping işlemini gerçek zamanlı takip
- **🌙 Dark Theme** — Modern, vibrant gradientler ve glassmorphism tasarım

## 🏛️ Desteklenen Teknokentler

| Teknokent | Şehir | Durum |
|---|---|---|
| Hacettepe Teknokent | Ankara | ✅ Aktif |
| ODTÜ Teknokent | Ankara | ✅ Aktif |
| Ankara Teknokent | Ankara | ✅ Aktif |
| Mersin Üniversitesi Teknokent | Mersin | ✅ Aktif |
| İTÜ Arı Teknokent | İstanbul | ⏳ Yakında |

## 🛠️ Teknoloji Stack

### Backend
- **Node.js** — Runtime
- **Express.js** — RESTful API framework
- **Axios** — HTTP istemcisi
- **Cheerio** — HTML parsing (web scraping)
- **ExcelJS** — Excel dosya oluşturma
- **UUID** — Benzersiz ID üretimi

### Frontend
- **Vue 3** — Composition API ile reactive UI
- **Vue Router** — SPA routing
- **Pinia** — State management
- **Chart.js** + **vue-chartjs** — Veri görselleştirme
- **Axios** — API iletişimi
- **Vite** — Build tool

## 📁 Proje Yapısı

```
teknokent-scraper/
├── server/                     # Backend API
│   ├── src/
│   │   ├── index.js            # Express server
│   │   ├── config/             # Teknokent konfigürasyonları
│   │   ├── routes/             # API route'ları
│   │   ├── scrapers/           # Web scraper modülleri
│   │   ├── store/              # JSON veri deposu
│   │   └── middleware/         # Error handling
│   └── package.json
│
├── client/                     # Vue 3 Frontend
│   ├── src/
│   │   ├── App.vue             # Root component
│   │   ├── router/             # Vue Router
│   │   ├── stores/             # Pinia stores
│   │   ├── views/              # Sayfa bileşenleri
│   │   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   └── assets/             # CSS ve statik dosyalar
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/health` | Sunucu durumu |
| `GET` | `/api/teknokentler` | Teknokent listesi |
| `GET` | `/api/firmalar` | Firma listesi (arama, filtreleme, sayfalama) |
| `GET` | `/api/firmalar/:id` | Firma detayı |
| `GET` | `/api/stats` | Dashboard istatistikleri |
| `POST` | `/api/scrape/:teknokentId` | Scraping başlat |
| `GET` | `/api/scrape/status` | Aktif scrape durumu |
| `GET` | `/api/scrape/history` | Scrape geçmişi |
| `GET` | `/api/export/excel` | Excel dosyası indir |

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js v18+
- npm

### 1. Repo'yu klonla
```bash
git clone https://github.com/<username>/teknokent-scraper.git
cd teknokent-scraper
```

### 2. Backend'i başlat
```bash
cd server
npm install
npm run dev
```
API `http://localhost:3000` adresinde çalışır.

### 3. Frontend'i başlat
```bash
cd client
npm install
npm run dev
```
Uygulama `http://localhost:5173` adresinde açılır.

## 📸 Kullanım

1. **Dashboard** — Genel istatistikleri ve grafikleri görüntüleyin
2. **Scraper** — Bir teknokent seçip scraping başlatın
3. **Firmalar** — Toplanan verileri arayın, filtreleyin
4. **Excel Export** — Firma listesini Excel olarak indirin

## 📄 Lisans

MIT License

---

> 🎯 *"Hayalindeki İşe Bir Adım Daha Yakın"*
