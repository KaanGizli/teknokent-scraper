/**
 * Scraper Factory - Teknokent'e göre doğru scraper'ı oluşturur
 */

const HacettepeScraper = require('./hacettepeScraper');
const OdtuScraper = require('./odtuScraper');
const AnkaraScraper = require('./ankaraScraper');
const MersinScraper = require('./mersinScraper');

const SCRAPER_MAP = {
    hacettepe: HacettepeScraper,
    odtu: OdtuScraper,
    ankara: AnkaraScraper,
    mersin: MersinScraper
};

function createScraper(teknokentConfig) {
    const ScraperClass = SCRAPER_MAP[teknokentConfig.id];

    if (!ScraperClass) {
        throw new Error(`"${teknokentConfig.id}" için scraper bulunamadı. Desteklenen: ${Object.keys(SCRAPER_MAP).join(', ')}`);
    }

    return new ScraperClass(teknokentConfig);
}

function getSupportedScrapers() {
    return Object.keys(SCRAPER_MAP);
}

module.exports = { createScraper, getSupportedScrapers };
