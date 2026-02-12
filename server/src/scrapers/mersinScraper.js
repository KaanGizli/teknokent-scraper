/**
 * Mersin Üniversitesi Teknokent Scraper
 */

const BaseScraper = require('./baseScraper');

class MersinScraper extends BaseScraper {
    isValidFirmaLink(href) {
        if (!href) return false;
        const { firma_patterns = [], exclude_patterns = [] } = this.config;

        const matchesPattern = firma_patterns.some(p => href.includes(p));
        if (!matchesPattern) return false;

        const isExcluded = exclude_patterns.some(p => href.includes(p));
        return !isExcluded;
    }

    async scrapeAll(onProgress) {
        const { base_url, category_url } = this.config;
        const fullUrl = base_url + category_url;

        const $ = await this.fetchPage(fullUrl);
        const links = new Set();

        // Config'deki seçicilerle ara
        const selectors = this.config.link_selectors || [];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const aTags = $(el).is('a') ? [el] : $(el).find('a[href]').toArray();
                for (const a of aTags) {
                    const href = $(a).attr('href');
                    if (this.isValidFirmaLink(href)) {
                        const fullLink = this.normalizeUrl(href, base_url);
                        if (fullLink) links.add(fullLink);
                    }
                }
            });
        }

        // Fallback: tüm linkleri tara
        if (links.size === 0) {
            $('a[href]').each((_, el) => {
                const href = $(el).attr('href');
                if (this.isValidFirmaLink(href)) {
                    const fullLink = this.normalizeUrl(href, base_url);
                    if (fullLink) links.add(fullLink);
                }
            });
        }

        const linkArray = [...links];
        const data = [];

        if (onProgress) onProgress(0, linkArray.length, 'Firma linkleri bulundu');

        for (let i = 0; i < linkArray.length; i++) {
            try {
                const detail$ = await this.fetchPage(linkArray[i]);

                let name = '—';
                for (const sel of (this.config.name_selectors || ['h1'])) {
                    const el = detail$(sel).first();
                    if (el.length && el.text().trim()) {
                        name = el.text().trim();
                        break;
                    }
                }

                let website = '—';
                // Mersin: web sitesini içerikten çekmeye çalış
                detail$('p, span, div').each((_, el) => {
                    const text = detail$(el).text();
                    if (text.includes('Web Sitesi:') || text.includes('web sitesi:')) {
                        const match = text.match(/https?:\/\/[^\s,<]+/);
                        if (match) {
                            website = match[0];
                            return false;
                        }
                    }
                });

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

module.exports = MersinScraper;
