/**
 * Hacettepe Teknokent Scraper
 * Link tabanlı: Firma listesi sayfasından linkleri çeker, her detay sayfasına girer
 */

const BaseScraper = require('./baseScraper');

class HacettepeScraper extends BaseScraper {
    async scrapeAll(onProgress) {
        const { base_url, category_url } = this.config;
        const fullUrl = base_url + category_url;

        // 1. Firma linklerini al
        const $ = await this.fetchPage(fullUrl);
        const links = new Set();

        // Firma linklerini bul
        $('a[href*="/tr/firma/"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/tr/firma/')) {
                const fullLink = this.normalizeUrl(href, base_url);
                if (fullLink) links.add(fullLink);
            }
        });

        // Alternatif: div.firma_adi içindaki linkler
        $('div.firma_adi a').each((_, el) => {
            const href = $(el).attr('href');
            if (href) {
                const fullLink = this.normalizeUrl(href, base_url);
                if (fullLink) links.add(fullLink);
            }
        });

        const linkArray = [...links];
        const data = [];

        if (onProgress) onProgress(0, linkArray.length, 'Firma linkleri bulundu');

        // 2. Her firma detay sayfasına gir
        for (let i = 0; i < linkArray.length; i++) {
            try {
                const detail$ = await this.fetchPage(linkArray[i]);

                // Firma adı
                let name = '—';
                for (const sel of this.config.name_selectors) {
                    const el = detail$(sel).first();
                    if (el.length && el.text().trim()) {
                        name = el.text().trim();
                        break;
                    }
                }

                // Web sitesi
                let website = '—';
                const arrowIcon = detail$('div.firma_detay_bilgi i.fa-arrow-pointer');
                if (arrowIcon.length && arrowIcon.parent().length) {
                    const text = arrowIcon.parent().text().trim();
                    if (text && text !== '—') website = text;
                }

                if (website === '—') {
                    detail$('a[href^="http"]').each((_, el) => {
                        const href = detail$(el).attr('href');
                        if (href && !href.includes('hacettepeteknokent') && !href.includes('facebook') && !href.includes('twitter') && !href.includes('linkedin') && !href.includes('instagram')) {
                            website = href;
                            return false;
                        }
                    });
                }

                data.push({ name, website });
                if (onProgress) onProgress(i + 1, linkArray.length, `${name}`);
            } catch (err) {
                data.push({ name: 'Hata', website: '—' });
                if (onProgress) onProgress(i + 1, linkArray.length, `Hata: ${linkArray[i]}`);
            }

            await this.delay(500);
        }

        return data;
    }
}

module.exports = HacettepeScraper;
