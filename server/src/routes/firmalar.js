/**
 * Firmalar Route - /api/firmalar
 */

const express = require('express');
const router = express.Router();
const { getAllFirmalar, getFirmaById } = require('../store/dataStore');

// GET /api/firmalar
router.get('/', (req, res) => {
    try {
        const result = getAllFirmalar({
            search: req.query.search,
            teknokent: req.query.teknokent,
            sort: req.query.sort,
            page: req.query.page,
            limit: req.query.limit
        });

        res.json({
            success: true,
            ...result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Firmalar alınırken hata oluştu'
        });
    }
});

// GET /api/firmalar/:id
router.get('/:id', (req, res) => {
    const firma = getFirmaById(req.params.id);

    if (!firma) {
        return res.status(404).json({
            success: false,
            error: 'Firma bulunamadı'
        });
    }

    res.json({
        success: true,
        data: firma
    });
});

module.exports = router;
