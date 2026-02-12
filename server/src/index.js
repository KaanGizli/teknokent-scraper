/**
 * Teknokent Scraper API - Express Server
 * RESTful API for scraping university technoparkcompany data
 */

const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { getStats } = require('./store/dataStore');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Routes
app.use('/api/teknokentler', require('./routes/teknokentler'));
app.use('/api/firmalar', require('./routes/firmalar'));
app.use('/api/scrape', require('./routes/scrape'));
app.use('/api/export', require('./routes/export'));

// Stats endpoint
app.get('/api/stats', (req, res) => {
    try {
        const stats = getStats();
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: 'İstatistikler alınamadı' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Teknokent Scraper API çalışıyor 🚀',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║  🏢 Teknokent Scraper API               ║
  ║  📡 http://localhost:${PORT}               ║
  ║  🚀 Hayalindeki İşe Bir Adım Daha Yakın ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
