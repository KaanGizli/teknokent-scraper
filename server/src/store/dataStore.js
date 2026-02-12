/**
 * Data Store - JSON dosya tabanlı basit veri saklama
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'firmalar.json');

function readData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { firmalar: [], lastUpdated: null, scrapeHistory: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getAllFirmalar(query = {}) {
    const data = readData();
    let firmalar = [...data.firmalar];

    // Search filter
    if (query.search) {
        const s = query.search.toLowerCase();
        firmalar = firmalar.filter(f =>
            f.name.toLowerCase().includes(s) ||
            (f.website && f.website.toLowerCase().includes(s))
        );
    }

    // Teknokent filter
    if (query.teknokent) {
        firmalar = firmalar.filter(f => f.teknokentId === query.teknokent);
    }

    // Sort
    if (query.sort === 'name') {
        firmalar.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (query.sort === 'teknokent') {
        firmalar.sort((a, b) => a.teknokentName.localeCompare(b.teknokentName, 'tr'));
    } else {
        firmalar.sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
    }

    const total = firmalar.length;

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;
    const paginatedFirmalar = firmalar.slice(offset, offset + limit);

    return {
        firmalar: paginatedFirmalar,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

function getFirmaById(id) {
    const data = readData();
    return data.firmalar.find(f => f.id === id) || null;
}

function addFirmalar(firmalar, teknokentId, teknokentName) {
    const data = readData();

    // Mevcut teknokent firmalarını sil (yenileriyle değiştir)
    data.firmalar = data.firmalar.filter(f => f.teknokentId !== teknokentId);

    // Yeni firmaları ekle
    const newFirmalar = firmalar.map(f => ({
        id: uuidv4(),
        name: f.name,
        website: f.website,
        teknokentId,
        teknokentName,
        scrapedAt: new Date().toISOString()
    }));

    data.firmalar.push(...newFirmalar);
    data.lastUpdated = new Date().toISOString();

    // Scrape geçmişine ekle
    data.scrapeHistory.push({
        id: uuidv4(),
        teknokentId,
        teknokentName,
        firmaCount: newFirmalar.length,
        scrapedAt: new Date().toISOString()
    });

    // Son 50 geçmişi tut
    if (data.scrapeHistory.length > 50) {
        data.scrapeHistory = data.scrapeHistory.slice(-50);
    }

    writeData(data);
    return newFirmalar;
}

function getStats() {
    const data = readData();
    const firmalar = data.firmalar;

    // Teknokent bazında dağılım
    const teknokentDist = {};
    firmalar.forEach(f => {
        if (!teknokentDist[f.teknokentName]) {
            teknokentDist[f.teknokentName] = 0;
        }
        teknokentDist[f.teknokentName]++;
    });

    // Website olan firma sayısı
    const withWebsite = firmalar.filter(f => f.website && f.website !== '—' && f.website !== '-').length;

    return {
        totalFirmalar: firmalar.length,
        totalTeknokent: Object.keys(teknokentDist).length,
        withWebsite,
        withoutWebsite: firmalar.length - withWebsite,
        teknokentDistribution: teknokentDist,
        lastUpdated: data.lastUpdated,
        recentScrapes: (data.scrapeHistory || []).slice(-10).reverse()
    };
}

function getScrapeHistory() {
    const data = readData();
    return (data.scrapeHistory || []).reverse();
}

module.exports = {
    getAllFirmalar,
    getFirmaById,
    addFirmalar,
    getStats,
    getScrapeHistory,
    readData
};
