/**
 * Teknokentler Route - GET /api/teknokentler
 */

const express = require('express');
const router = express.Router();
const { getActiveTeknokentler, getAllTeknokentler, getTeknokentById } = require('../config/teknokentler');
const { getSupportedScrapers } = require('../scrapers');

// GET /api/teknokentler
router.get('/', (req, res) => {
    const teknokentler = getAllTeknokentler();
    const supported = getSupportedScrapers();

    const result = teknokentler.map(t => ({
        id: t.id,
        name: t.name,
        city: t.city,
        active: t.active,
        scrapeSupported: supported.includes(t.id)
    }));

    res.json({
        success: true,
        data: result,
        total: result.length
    });
});

// GET /api/teknokentler/:id
router.get('/:id', (req, res) => {
    const teknokent = getTeknokentById(req.params.id);

    if (!teknokent) {
        return res.status(404).json({
            success: false,
            error: 'Teknokent bulunamadı'
        });
    }

    res.json({
        success: true,
        data: {
            id: teknokent.id,
            name: teknokent.name,
            city: teknokent.city,
            active: teknokent.active,
            base_url: teknokent.base_url
        }
    });
});

module.exports = router;
