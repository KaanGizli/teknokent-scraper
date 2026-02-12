/**
 * Base Scraper - Tüm scraper'ların temel sınıfı
 */

const axios = require('axios');
const cheerio = require('cheerio');

class BaseScraper {
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive'
            }
        });
    }

    async fetchPage(url) {
        const response = await this.client.get(url);
        return cheerio.load(response.data);
    }

    normalizeUrl(href, baseUrl) {
        if (!href) return null;
        if (href.startsWith('http')) return href;
        if (href.startsWith('/')) return baseUrl + href;
        return baseUrl + '/' + href;
    }

    /**
     * Override this method in subclasses
     * @param {Function} onProgress - callback(current, total, message)
     * @returns {Promise<Array<{name: string, website: string}>>}
     */
    async scrapeAll(onProgress) {
        throw new Error('scrapeAll() must be implemented by subclass');
    }

    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BaseScraper;
