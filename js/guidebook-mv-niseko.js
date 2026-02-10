/**
 * Guest Guidebook - JavaScript for Mountain Villa Niseko
 * Replicates the logic and UI structure of Lake House (guidebook.js)
 */

window.currentLang = localStorage.getItem('siteLang') || 'en';

// ============================================
// ICONS (Monochrome SVG) - Matches Lake House
// ============================================
const ICONS = {
    address: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    parking: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
    car: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>',
    train: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    taxi: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    checkin: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>',
    water: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
    amenities: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>',
    kitchen: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    bath: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M9 21h6"></path><path d="M5 21a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5z"></path></svg>',
    dishes: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
    condiments: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
    rentals: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>',
    ac: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>',
    wifi: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>',
    rooms: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    trash: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    goods: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    sightseeing: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    restaurant: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    cancel: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    smoke: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>',
    noise: '<svg class="icon-inline" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
    damage: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    time: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    money: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
    luggage: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    power: '<svg class="icon-inline" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    receipt: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    bbq: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="10" r="7"></circle><path d="M12 17v4M8 21h8M9 7v3M12 6v4M15 7v3"></path></svg>',
    fire: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 22c-4.97 0-9-4.03-9-9 0-4 4-8 4-12 0 0 3 2 4 6 1.5-2 2-4 2-4s3 2.5 3 6c2-1 3-2.5 3-2.5s2 3.5 2 6.5c0 4.97-4.03 9-9 9z"></path></svg>',
    tv: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
    mic: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
    laundry: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><path d="M12 18a5 5 0 0 1-5-5"></path></svg>',
    info: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    help: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
};

// ============================================
// GUIDEBOOK DATA STRUCTURE (Bilingual)
// ============================================
const guidebookData = {
    propertyId: "MV_NISEKO",
    propertyName: "Mountain Villa ニセコ / Mountain Villa Niseko",
    heroImage: "img/mv_niseko/hero.jpg",
    welcomeMessage: {
        en: "Welcome to Mountain Villa Niseko! Here's everything you need for your stay.",
        jp: "Mountain Villa ニセコへようこそ！快適な滞在のための情報をご案内します。"
    },
    access: {
        id: "access",
        title: { en: "Access & WiFi", jp: "アクセス ＆ WiFi" },
        items: [
            {
                icon: "checkin",
                title: { en: "Check-in Guide", jp: "チェックイン・アウト方法" },
                content: {
                    en: `<p>Please follow the self check-in instructions provided via email.</p>
                        <p><img src="img/mv_niseko/checkin.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Check-in"></p>`,
                    jp: `<p>メールで送られたセルフチェックインの手順に従ってください。</p>
                        <p><img src="img/mv_niseko/checkin.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Check-in"></p>`
                }
            },
            {
                icon: "wifi",
                title: { en: "WiFi", jp: "WiFi" },
                content: {
                    en: `<p>SSID: MV_NISEKO_WIFI<br>Password: nisekostay</p>`,
                    jp: `<p>SSID: MV_NISEKO_WIFI<br>パスワード: nisekostay</p>`
                }
            },
            {
                icon: "address",
                title: { en: "Address", jp: "住所" },
                content: {
                    en: `<p>Niseko-cho, Abuta-gun, Hokkaido<br>
                        <a href="https://maps.app.goo.gl/xxxx" target="_blank">📍 Open in Google Maps</a></p>`,
                    jp: `<p>北海道虻田郡ニセコ町<br>
                        <a href="https://maps.app.goo.gl/xxxx" target="_blank">📍 Google Mapsで開く</a></p>`
                }
            },
            {
                icon: "parking",
                title: { en: "Parking", jp: "駐車場" },
                content: {
                    en: `<p>Parking is available on site.</p>
                        <p><img src="img/mv_niseko/parking.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Parking"></p>`,
                    jp: `<p>敷地内に駐車場がございます。</p>
                        <p><img src="img/mv_niseko/parking.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Parking"></p>`
                }
            }
        ]
    },
    sections: [
        {
            id: "facility",
            title: { en: "Room & Equipment Guide", jp: "各部屋と備品のご案内" },
            items: [
                {
                    icon: "tv",
                    title: { en: "Living Room", jp: "リビング" },
                    content: {
                        en: `<p>Enjoy your stay in the spacious living room.</p>
                            <p><img src="img/mv_niseko/living.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Living Room"></p>`,
                        jp: `<p>広々としたリビングでおくつろぎください。</p>
                            <p><img src="img/mv_niseko/living.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Living Room"></p>`
                    }
                },
                {
                    icon: "water",
                    title: { en: "Heating & Water Heater", jp: "暖房・給湯器" },
                    content: {
                        en: `<p>Instructions for heating and hot water system. Detailed manual is available inside the villa.</p>`,
                        jp: `<p>暖房と給湯器の操作方法です。詳細なマニュアルは室内にございます。</p>`
                    }
                },
                {
                    icon: "bbq",
                    title: { en: "BBQ", jp: "BBQ" },
                    content: {
                        en: `<p>BBQ equipment is available for use. Enjoy outdoor cooking!</p>`,
                        jp: `<p>BBQ設備をご利用いただけます。屋外での料理をお楽しみください。</p>`
                    }
                }
            ]
        },
        {
            id: "neighborhood",
            title: { en: "Neighborhood", jp: "周辺情報" },
            items: [
                {
                    icon: "goods",
                    title: { en: "Supermarkets", jp: "スーパー" },
                    content: {
                        en: `<p>Local supermarkets are located within 10-15 mins drive.</p>`,
                        jp: `<p>地元のスーパーは車で10〜15分圏内にあります。</p>`
                    }
                }
            ]
        },
        {
            id: "rules",
            title: { en: "House Rules", jp: "ハウスルール" },
            items: [
                {
                    icon: "cancel",
                    title: { en: "Strict Rules", jp: "守っていただきたいこと" },
                    content: {
                        en: `<p>No smoking, no loud music, no pets.</p>`,
                        jp: `<p>禁煙、騒音禁止、ペット禁止です。</p>`
                    }
                }
            ]
        },
        {
            id: "faq",
            title: { en: "FAQ", jp: "よくある質問" },
            items: [
                {
                    icon: "help",
                    title: { en: "Check-out time", jp: "チェックアウト時間" },
                    content: {
                        en: `<p>Check-out time is 10:00 AM.</p>`,
                        jp: `<p>チェックアウトは午前10時です。</p>`
                    }
                }
            ]
        }
    ]
};

// ============================================
// CORE LOGIC
// ============================================

const categories = [
    { id: 'access', title: { en: 'Access & WiFi', jp: 'アクセス ＆ WiFi' }, icon: 'address' },
    { id: 'facility', title: { en: 'Room & Equipment Guide', jp: '各部屋と備品のご案内' }, icon: 'rooms' },
    { id: 'neighborhood', title: { en: 'Neighborhood', jp: '周辺情報' }, icon: 'sightseeing' },
    { id: 'rules', title: { en: 'House Rules', jp: 'ハウスルール' }, icon: 'cancel' },
    { id: 'faq', title: { en: 'FAQ', jp: 'よくある質問' }, icon: 'receipt' }
];

let activeCategory = 'access';

function getLang() {
    return window.currentLang || 'en';
}

function getLocalizedText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = getLang();
    return obj[lang] || obj.en || obj.jp || '';
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderPropertyInfo();
    renderTopNav();
    renderSections();

    // Initial content setup
    window.updateContent();
    updateLanguageLabel();

    // Default Tab
    switchCategory('access');

    // Init Search
    initSearch();
}

function renderPropertyInfo() {
    document.getElementById('property-name').textContent = getLocalizedText(guidebookData.propertyName);
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) heroImg.src = guidebookData.heroImage;
    document.getElementById('welcome-message').textContent = getLocalizedText(guidebookData.welcomeMessage);
}

function renderTopNav() {
    const container = document.getElementById('top-nav-container');
    if (!container) return;

    container.innerHTML = `<nav class="top-nav-scroll">
        ${categories.map(cat => `
            <button class="top-nav-item ${cat.id === activeCategory ? 'active' : ''}" 
                    onclick="switchCategory('${cat.id}')">
                ${ICONS[cat.icon] || ''} ${getLocalizedText(cat.title)}
            </button>
        `).join('')}
    </nav>`;
}

window.switchCategory = function (catId) {
    activeCategory = catId;

    // Update Tabs
    renderTopNav();

    // Update Sidebar Active Class
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${catId}` || item.onclick?.toString().includes(`'${catId}'`)) {
            item.classList.add('active');
        }
    });

    // Toggle Hero & Layout classes
    const layout = document.querySelector('.guidebook-layout');
    const hero = document.querySelector('.guidebook-hero');
    const isAccess = (catId === 'access');

    if (hero) hero.style.display = isAccess ? 'block' : 'none';
    if (layout) {
        if (isAccess) layout.classList.add('has-hero');
        else layout.classList.remove('has-hero');
    }

    // Toggle Sections
    document.querySelectorAll('.guidebook-section').forEach(sec => {
        sec.style.display = (sec.id === `section-${catId}` ? 'block' : 'none');
    });

    // Render Sidebar Sub-items (GitBook style sub-navigation)
    renderSidebarItems(catId);

    window.scrollTo({ top: 0, behavior: 'instant' });
};

function renderSidebarItems(catId) {
    const nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    // We want to keep the main category links but show sub-items under the active one
    // OR we just follow Lake House which (in our JS) replaces the content?
    // User wants "Left Sidebar (Access & WiFi's sub items)".
    // So let's replace the whole nav content with sub-items when a category is active
    // BUT the user said "Match Lake House".

    let html = '';
    const items = catId === 'access' ? guidebookData.access.items : (guidebookData.sections.find(s => s.id === catId)?.items || []);

    items.forEach((item, index) => {
        html += `<a href="#" class="sidebar-subitem" onclick="scrollToId('item-${catId}-${index}', event)">
            ${ICONS[item.icon] || ''} ${getLocalizedText(item.title)}
        </a>`;
    });

    // If we want to keep being able to switch categories from sidebar, the sidebar should contain main categories too.
    // In Lake House, it seems the sidebar is used for sub-navigation.
    nav.innerHTML = html;
}

function renderSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;

    let html = '';

    // Access
    html += `<section class="guidebook-section" id="section-access">
        <h2 class="section-title">${getLocalizedText(guidebookData.access.title)}</h2>
        <div class="content-cards">
            ${guidebookData.access.items.map((item, index) => renderCard(item, 'access', index)).join('')}
        </div>
    </section>`;

    // Dynamic
    guidebookData.sections.forEach(sec => {
        html += `<section class="guidebook-section" id="section-${sec.id}">
            <h2 class="section-title">${getLocalizedText(sec.title)}</h2>
            <div class="content-cards">
                ${sec.items.map((item, index) => renderCard(item, sec.id, index)).join('')}
            </div>
        </section>`;
    });

    container.innerHTML = html;
}

function renderCard(item, sectionId, index) {
    return `<div class="content-card" id="item-${sectionId}-${index}">
        <h3 class="card-header">${ICONS[item.icon] || ''} ${getLocalizedText(item.title)}</h3>
        <div class="card-body">${getLocalizedText(item.content)}</div>
    </div>`;
}

window.scrollToId = function (id, event) {
    if (event) event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = window.innerWidth <= 768 ? 180 : 160;
    const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: pos, behavior: 'smooth' });
};

window.updateContent = () => {
    const lang = getLang();
    const t = window.translations?.[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.body.className = `guidebook-page lang-${lang}`;
};

window.toggleLanguage = (lang) => {
    window.currentLang = lang;
    localStorage.setItem('siteLang', lang);
    initApp();
};

function updateLanguageLabel() {
    const l = document.getElementById('mobile-lang-label');
    const d = document.getElementById('current-lang-display');
    if (l) l.textContent = window.currentLang.toUpperCase();
    if (d) d.textContent = window.currentLang.toUpperCase();
}

function initSearch() {
    const input = document.getElementById('guidebook-search');
    const res = document.getElementById('search-results');
    if (!input || !res) return;
    input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if (q.length < 2) { res.classList.remove('active'); return; }
        // Simple search index
        let items = [];
        [guidebookData.access, ...guidebookData.sections].forEach(s => {
            s.items.forEach((it, idx) => {
                items.push({ id: `item-${s.id}-${idx}`, sid: s.id, t: getLocalizedText(it.title) });
            });
        });
        const hits = items.filter(it => it.t.toLowerCase().includes(q));
        res.innerHTML = hits.map(h => `<div class="search-result-item" onclick="navigateToSearchResult('${h.sid}', '${h.id}')">${h.t}</div>`).join('');
        res.classList.add('active');
    });
}

window.navigateToSearchResult = (sid, id) => {
    switchCategory(sid);
    setTimeout(() => scrollToId(id), 300);
    document.getElementById('search-results').classList.remove('active');
};
