/**
 * Teknokent Konfigürasyonları
 * Python config.py'den port edildi
 */

const TEKNOKENTLER = {
  hacettepe: {
    id: 'hacettepe',
    name: 'Hacettepe Teknokent',
    city: 'Ankara',
    base_url: 'https://www.hacettepeteknokent.com.tr',
    category_url: '/tr/firma_rehberi/bilgisayar_ve_iletisim_teknolojileri-16',
    firma_link_prefix: '/tr/firma/',
    name_selectors: [
      'div.firma_detay_baslik',
      'h1.firma_detay_baslik',
      'h1',
      '.firma_adi'
    ],
    site_selectors: [
      'div.firma_detay_bilgi i.fa-arrow-pointer',
      "a[href*='http']"
    ],
    active: true,
    type: 'link-based'
  },

  ankara: {
    id: 'ankara',
    name: 'Ankara Teknokent',
    city: 'Ankara',
    base_url: 'https://firmarehberi.ankarateknokent.com',
    category_url: '',
    firma_link_prefix: '/firma/',
    name_selectors: [
      'h4.listing-preview-title',
      'h1',
      '.listing-preview-title'
    ],
    site_selectors: [
      "li.lmb-calltoaction a[target='_blank']",
      "a[href*='http'][target='_blank']",
      "a[rel='nofollow']"
    ],
    active: true,
    type: 'link-based',
    needsSelenium: true
  },

  odtu: {
    id: 'odtu',
    name: 'ODTÜ Teknokent',
    city: 'Ankara',
    base_url: 'https://odtuteknokent.com.tr/tr/firmalar/tum-firmalar.php',
    active: true,
    type: 'table-based'
  },

  mersin: {
    id: 'mersin',
    name: 'Mersin Üniversitesi Teknokent',
    city: 'Mersin',
    base_url: 'https://www.technoscope.com.tr',
    category_url: '/menu/bilisim',
    firma_link_prefix: '/',
    link_selectors: [
      'div.col-6.col-sm-12.col-md-6.col-lg-3.d-flex',
      'div.blog-item',
      'div.blog__img a'
    ],
    firma_patterns: ['technoscope.com.tr'],
    exclude_patterns: [
      '/menu/',
      '/firmalar/',
      'technoscope.com.tr/$',
      'technoscope.com.tr/menu',
      'technoscope.com.tr/iletisim',
      'technoscope.com.tr/hakkimizda'
    ],
    name_selectors: [
      'h4.blog__title a',
      'h4.blog__title',
      '.blog__title a',
      'h1',
      'h2'
    ],
    site_selectors: [],
    active: true,
    type: 'link-based'
  },

  itu: {
    id: 'itu',
    name: 'İTÜ Arı Teknokent',
    city: 'İstanbul',
    base_url: 'https://www.ariteknokent.com.tr',
    category_url: '/companies',
    firma_link_prefix: '/company/',
    name_selectors: [
      'h1.company_name',
      'div.title',
      'h1'
    ],
    site_selectors: [
      'div.website_link a',
      "a[href*='http']"
    ],
    active: false,
    type: 'link-based'
  }
};

function getActiveTeknokentler() {
  return Object.values(TEKNOKENTLER).filter(t => t.active);
}

function getAllTeknokentler() {
  return Object.values(TEKNOKENTLER);
}

function getTeknokentById(id) {
  return TEKNOKENTLER[id] || null;
}

module.exports = {
  TEKNOKENTLER,
  getActiveTeknokentler,
  getAllTeknokentler,
  getTeknokentById
};
