/**
 * ODTÜ Teknokent Scraper
 * Tablo tabanlı: Firmaları HTML tablodan çeker
 */

const BaseScraper = require('./baseScraper');

class OdtuScraper extends BaseScraper {
    async scrapeAll(onProgress) {
        const url = this.config.base_url;

        const $ = await this.fetchPage(url);

        // Tablolu yapıdan firmaları çek
        const table = $('table.table.table-striped.table-bordered');
        if (!table.length) {
            // Alternatif tablo seçiciler dene
            const altTable = $('table').first();
            if (!altTable.length) {
                console.warn('ODTÜ tablolu firma listesi bulunamadı!');
                return [];
            }
        }

        const rows = $('table tr').toArray();
        const data = [];

        // İlk satır başlık, atla
        for (let i = 1; i < rows.length; i++) {
            const cols = $(rows[i]).find('td');
            if (cols.length >= 2) {
                const name = $(cols[0]).text().trim();
                const siteTag = $(cols[1]).find('a[href]');
                const website = siteTag.length ? siteTag.attr('href').trim() : '—';

                if (name) {
                    data.push({ name, website });
                    if (onProgress) onProgress(i, rows.length - 1, `${name}`);
                }
            }
        }

        return data;
    }
}

module.exports = OdtuScraper;
