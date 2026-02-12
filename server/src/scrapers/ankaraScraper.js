/**
 * Ankara Teknokent Scraper
 * Link tabanlı scraper
 */

const BaseScraper = require('./baseScraper');

class AnkaraScraper extends BaseScraper {
    async scrapeAll(onProgress) {
        const { base_url, category_url } = this.config;
        const fullUrl = base_url + (category_url || '');

        const $ = await this.fetchPage(fullUrl);
        const links = new Set();

        // Firma linklerini bul
        $('a[href*="/firma/"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/firma/')) {
                const fullLink = this.normalizeUrl(href, base_url);
                if (fullLink) links.add(fullLink);
            }
        });

        // Alternatif: listing container'lar
        $('div.lf-item-container a').each((_, el) => {
            const href = $(el).attr('href');
            if (href) {
                const fullLink = this.normalizeUrl(href, base_url);
                if (fullLink) links.add(fullLink);
            }
        });

        const linkArray = [...links];
        const data = [];

        if (onProgress) onProgress(0, linkArray.length, 'Firma linkleri bulundu');

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
                const ctaLink = detail$("li.lmb-calltoaction a[target='_blank']");
                if (ctaLink.length) {
                    const href = ctaLink.attr('href');
                    if (href && href.startsWith('http')) {
                        website = href.replace(/%20/g, '').trim();
                    }
                }

                if (website === '—') {
                    detail$("a[href^='http'][target='_blank']").each((_, el) => {
                        const href = detail$(el).attr('href');
                        if (href && !href.includes('ankarateknokent') && !href.includes('facebook') && !href.includes('twitter')) {
                            website = href.replace(/%20/g, '').trim();
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

module.exports = AnkaraScraper;
