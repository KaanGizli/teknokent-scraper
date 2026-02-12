/**
 * Scrape Route - /api/scrape
 * Scraping işlemlerini tetikler ve durumunu takip eder
 */

const express = require('express');
const router = express.Router();
const { getTeknokentById } = require('../config/teknokentler');
const { createScraper } = require('../scrapers');
const { addFirmalar, getScrapeHistory } = require('../store/dataStore');

// Aktif scrape durumunu tutar
let activeScrape = null;

// POST /api/scrape/:teknokentId
router.post('/:teknokentId', async (req, res) => {
    const { teknokentId } = req.params;

    // Aktif bir scrape varsa reddet
    if (activeScrape) {
        return res.status(409).json({
            success: false,
            error: `Şu anda "${activeScrape.teknokentName}" için scraping devam ediyor. Lütfen bekleyin.`
        });
    }

    // Teknokent config al
    const config = getTeknokentById(teknokentId);
    if (!config) {
        return res.status(404).json({
            success: false,
            error: 'Teknokent bulunamadı'
        });
    }

    if (!config.active) {
        return res.status(400).json({
            success: false,
            error: 'Bu teknokent şu anda aktif değil'
        });
    }

    // Scrape'i başlat (async, hemen response dön)
    activeScrape = {
        teknokentId,
        teknokentName: config.name,
        status: 'running',
        current: 0,
        total: 0,
        message: 'Başlatılıyor...',
        startedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: `${config.name} için scraping başlatıldı`,
        scrapeId: teknokentId
    });

    // Arka planda scrape et
    try {
        const scraper = createScraper(config);

        const data = await scraper.scrapeAll((current, total, message) => {
            if (activeScrape) {
                activeScrape.current = current;
                activeScrape.total = total;
                activeScrape.message = message;
            }
        });

        // Verileri kaydet
        if (data && data.length > 0) {
            addFirmalar(data, teknokentId, config.name);
            if (activeScrape) {
                activeScrape.status = 'completed';
                activeScrape.message = `${data.length} firma başarıyla kaydedildi`;
                activeScrape.firmaCount = data.length;
            }
        } else {
            if (activeScrape) {
                activeScrape.status = 'completed';
                activeScrape.message = 'Firma bulunamadı';
                activeScrape.firmaCount = 0;
            }
        }
    } catch (err) {
        console.error('Scrape hatası:', err);
        if (activeScrape) {
            activeScrape.status = 'error';
            activeScrape.message = `Hata: ${err.message}`;
        }
    }

    // 5 saniye sonra active scrape'i temizle
    setTimeout(() => {
        activeScrape = null;
    }, 5000);
});

// GET /api/scrape/status
router.get('/status', (req, res) => {
    if (!activeScrape) {
        return res.json({
            success: true,
            data: { status: 'idle', message: 'Aktif scrape yok' }
        });
    }

    res.json({
        success: true,
        data: activeScrape
    });
});

// GET /api/scrape/history
router.get('/history', (req, res) => {
    const history = getScrapeHistory();
    res.json({
        success: true,
        data: history
    });
});

module.exports = router;
