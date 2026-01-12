// Utilities
const getElement = (selector) => document.querySelector(selector);
const formatPrice = (price) => `¥${price.toLocaleString()}`;

// Monotone Icons (SVG)
const icons = {
    bed: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
    bath: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/></svg>`, // Simplified bath
    guests: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    wifi: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    parking: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M9 15h6"/></svg>`, // Generic car/parking feel
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
};

// --- I18N LOGIC ---
const translations = window.translations || {}; // Ensure it exists
window.currentLang = localStorage.getItem('siteLang') || 'en';

window.toggleLanguage = () => {
    window.currentLang = window.currentLang === 'en' ? 'jp' : 'en';
    localStorage.setItem('siteLang', window.currentLang);
    window.updateContent();

    // Re-render components if they exist
    if (document.getElementById('featured-grid') && window.createCard) {
        const featuredContainer = document.getElementById('featured-grid');
        featuredContainer.innerHTML = '';
        window.properties.forEach(property => {
            featuredContainer.innerHTML += window.createCard(property);
        });
        // Re-attach observers
        setTimeout(() => {
            const cards = document.querySelectorAll('.property-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
            });
            cards.forEach(c => {
                observer.observe(c);
                if (window.cardScrollObserver) window.cardScrollObserver.observe(c);
            });
        }, 100);
    }
    if (window.updatePropertyList) {
        window.updatePropertyList(window.properties);
    }
};

window.updateContent = () => {
    // Update static text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // translations object comes from translations.js
        if (typeof translations !== 'undefined' && translations[window.currentLang] && translations[window.currentLang][key]) {
            el.textContent = translations[window.currentLang][key];
        }
    });
};

// Helper to get localized property field
const getPropField = (prop, field) => {
    if (window.currentLang === 'jp') {
        return prop[field + '_jp'] || prop[field];
    }
    return prop[field];
};

// Data Loading & Init
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof loadProperties === 'function') {
        try {
            const properties = await loadProperties();
            window.properties = properties;
        } catch (e) {
            console.error("Failed to load properties", e);
            window.properties = []; // Fallback
        }
    }

    if (window.initApp) {
        window.initApp();
    }
});

// App Logic encapsulated
window.initApp = () => {

    // --- SHARED LOGIC (Modals, SPA Handler) ---

    // 0. Global Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                // Mobile Search: Reset if needed
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 0.2 Mobile Search Modal Logic
    window.openSearch = () => {
        document.getElementById('search-modal').classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closeSearch = () => {
        document.getElementById('search-modal').classList.remove('active');
        document.body.style.overflow = '';
    };

    window.clearSearch = () => {
        const modal = document.getElementById('search-modal');
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');

        // Reset chips
        modal.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    };

    // Filter Chip Toggle
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
        });
    });

    // 0.3 Mobile Menu Logic
    window.openMenu = () => {
        document.getElementById('mobile-menu').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeMenu = () => {
        document.getElementById('mobile-menu').classList.remove('active');
        document.body.style.overflow = '';
    };

    // --- SHARED HELPER: FETCH EARLIEST DATE ---
    window.fetchEarliestDate = async (propertyId) => {
        // Find property to get roomId
        const property = window.properties.find(p => p.id === propertyId);
        if (!property || !property.roomId) {
            console.warn(`Missing roomId for property ${propertyId}`);
            return null; // Treated as unavailable
        }

        const beds24RoomId = property.roomId;

        // Fetch next 60 days
        const today = new Date();
        const end = new Date(today);
        end.setDate(today.getDate() + 60);

        const formatDate = (d) => {
            const z = (n) => ('0' + n).slice(-2);
            return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
        };

        try {
            // First check if property already has _availability data from initial load
            let availMap = {};

            if (property._availability && Object.keys(property._availability).length > 0) {
                // Use pre-loaded data
                availMap = property._availability;
                console.log(`[fetchEarliestDate] Using pre-loaded availability for room ${beds24RoomId}`);
            } else {
                // Fetch from API - use /api/beds24-availability (the working endpoint)
                const res = await fetch(`/api/beds24-availability?roomId=${beds24RoomId}&startDate=${formatDate(today)}&endDate=${formatDate(end)}`);
                if (!res.ok) throw new Error(`API Error ${res.status}`);
                const json = await res.json();

                if (json.data && json.data.length > 0 && json.data[0].availability) {
                    availMap = json.data[0].availability;
                }
            }

            // Find first available date
            let d = new Date(today);
            d.setDate(d.getDate() + 1); // Start checking from tomorrow (since today is blocked)

            // Look ahead 60 days
            for (let i = 0; i < 60; i++) {
                const key = formatDate(d);
                const avail = availMap[key];
                let isAvail = true;

                // Strict Availability Check
                if (avail !== undefined) {
                    if (typeof avail === 'boolean') isAvail = avail;
                    else if (typeof avail === 'object') {
                        if (avail.status == 0) isAvail = false;
                        else if ('quantity' in avail && parseInt(avail.quantity) <= 0) isAvail = false;
                    }
                }

                if (isAvail) return d; // Return Date Object
                d.setDate(d.getDate() + 1);
            }
            return null; // Sold out in window
        } catch (e) {
            console.warn(`Failed to fetch earliest date for ${propertyId}`, e);
            return null;
        }
    };

    // --- SHARED HELPER: CARD UPDATER ---
    window.updateCardAvailability = async () => {
        if (!window.properties) return;

        // Helper for Home cards mainly, harmless elsewhere
        document.querySelectorAll('.card-image-wrapper').forEach(el => el.style.position = 'relative');

        const promises = window.properties.map(async (p) => {
            const badges = document.querySelectorAll(`.availability-badge[data-badge-id="${p.id}"]`);
            if (badges.length === 0) return;

            const earliest = await window.fetchEarliestDate(p.id);

            badges.forEach(badge => {
                if (badge.parentElement && getComputedStyle(badge.parentElement).position === 'static') {
                    badge.parentElement.style.position = 'relative';
                }

                // Remove loading state
                badge.classList.remove('loading');

                if (earliest) {
                    const m = (earliest.getMonth() + 1);
                    const d = earliest.getDate();
                    const dateStr = `${m}/${d}`;

                    // Use SVG Icon with smooth appearance
                    badge.innerHTML = `<span style="display:flex; align-items:center; gap:4px;">${icons.calendar} ${dateStr} ~</span>`;
                    badge.style.opacity = '0';
                    badge.style.transition = 'opacity 0.3s ease';
                    requestAnimationFrame(() => {
                        badge.style.opacity = '1';
                    });
                } else {
                    const unavailableText = window.currentLang === 'jp' ? '利用不可' : 'Unavailable';
                    badge.innerHTML = unavailableText;
                    badge.style.opacity = '1';
                }
            });
        });

        await Promise.all(promises);
    };

    // 1. Open Property SPA Handler (Used by BOTH pages)
    window.openProperty = (id) => {
        const property = window.properties.find(p => p.id === id);
        if (!property) return;
        const detailView = document.getElementById('detail-view');
        const content = document.getElementById('detail-content');

        // Note: Map recentering is Home-specific.
        if (typeof window.updateMapPosition === 'function') {
            window.updateMapPosition(id);
        }

        // Localized Fields
        const name = getPropField(property, 'name');
        const location = getPropField(property, 'location');
        const description = getPropField(property, 'description');
        const amenities = getPropField(property, 'amenities');

        // Localized UI Labels
        const isJp = window.currentLang === 'jp';
        const labels = {
            bedrooms: isJp ? 'ベッドルーム' : 'Bedrooms',
            bathrooms: isJp ? 'バスルーム' : 'Bathrooms',
            guests: isJp ? '定員' : 'Guests',
            wifi: isJp ? '高速WiFi' : 'Fast WiFi',
            parking: isJp ? '駐車場' : 'Parking',
            about: isJp ? 'この宿泊施設について' : 'About this stay',
            experience: isJp
                ? '究極の日本のラグジュアリー体験を。卓越したデザイン、ロケーション、アメニティを厳選しました。'
                : 'Experience the ultimate in Japanese luxury living. This property has been curated for its exceptional design, location, and amenities.',
            amenitiesTitle: isJp ? 'アメニティ' : 'Amenities',
            mapPlaceholder: isJp ? '詳細地図は準備中です' : 'Detailed Map Coming Soon',
            night: isJp ? '/ 泊' : '/ night',
            checkAvailability: isJp ? '空室状況を確認' : 'Check Availability'
        };

        content.innerHTML = `
            <div class="detail-hero">
                <img src="${property.images[0]}" alt="${name}">
                <div class="container detail-overlay-content">
                    <span class="subtitle">${location}</span>
                    <h1 style="font-size: 3rem; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">${name}</h1>
                    <div class="key-facts">
                         <div class="fact-item">${icons.bed} ${property.details.bedrooms} ${labels.bedrooms}</div>
                         <div class="fact-item">${icons.bath} ${property.details.bath} ${labels.bathrooms}</div>
                         <div class="fact-item">${icons.guests} ${property.details.guests} ${labels.guests}</div>
                         <div class="fact-item">${icons.wifi} ${labels.wifi}</div>
                         <div class="fact-item">${icons.parking} ${labels.parking}</div>
                    </div>
                </div>
            </div>
            <div class="split-layout">
                <div class="left-col">
                    <h2 style="margin-bottom:1rem;">${labels.about}</h2>
                    <p style="font-size:1.1rem; color:#ccc; line-height:1.8; margin-bottom:2rem;">
                        ${description}
                        <br><br>
                        ${labels.experience}
                    </p>
                    <h3 style="margin-top:3rem;">${labels.amenitiesTitle}</h3>
                    <div class="amenities-list" style="margin-top:1rem; display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                        ${amenities.map(a => `<div style="color:#ddd; display:flex; align-items:center; gap:0.5rem;">${icons.check} ${a}</div>`).join('')}
                    </div>
                    <div style="margin-top:2rem; height:200px; background:#222; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#555;">${labels.mapPlaceholder}</div>
                </div>
                <div class="right-col">
                    <div class="booking-widget" id="booking-widget-${property.id}">
                        <div class="booking-header">
                            <div>
                                <span class="booking-price">¥${property.price.toLocaleString()}</span>
                                <span class="booking-price-note"> ${labels.night}</span>
                            </div>
                        </div>
                        
                        <div class="booking-inputs-grid">
                            <div class="booking-input-item" onclick="openAvailabilityCalendar(${property.id})">
                                <span class="input-label">CHECK-IN</span>
                                <span class="input-value" id="widget-checkin-${property.id}">Add date</span>
                            </div>
                            <div class="booking-input-item" onclick="openAvailabilityCalendar(${property.id})">
                                <span class="input-label">CHECK-OUT</span>
                                <span class="input-value" id="widget-checkout-${property.id}">Add date</span>
                            </div>
                        </div>
                        <div class="guest-input-item" onclick="openAvailabilityCalendar(${property.id})">
                            <div>
                                <span class="input-label">GUESTS</span>
                                <span class="input-value" id="widget-guests-${property.id}">1 Guest</span>
                            </div>
                            ${icons.arrowDown || '<span style="font-size:0.8rem">▼</span>'}
                        </div>

                         <button id="book-btn-${property.id}" class="btn btn-primary" style="width:100%; border-radius:8px; padding:1rem; font-weight:600;" onclick="openAvailabilityCalendar(${property.id})">
                            ${labels.checkAvailability}
                         </button>
                         
                         <div style="text-align:center; margin-top:1rem; font-size:0.8rem; color:#666;">
                            You won't be charged yet
                         </div>
                    </div>
                </div>
            </div>
        `;
        detailView.classList.add('active');
        document.body.style.overflow = 'hidden';

        // --- FETCH EARLIEST DATE LOGIC (DETAIL VIEW) ---
        (async () => {
            const btn = document.getElementById(`book-btn-${property.id}`);
            if (!btn) return;

            // 1. Show Loading
            // Keep button text generic while loading or "Checking..."
            const loadingText = window.currentLang === 'jp' ? '確認中...' : 'Checking availability...';
            btn.innerHTML = `<span class="avail-loading">${loadingText}</span>`;

            const earliest = await window.fetchEarliestDate(property.id);

            if (earliest) {
                // Format date: "YYYY/MM/DD ~"
                const y = earliest.getFullYear();
                const m = ('0' + (earliest.getMonth() + 1)).slice(-2);
                const d = ('0' + earliest.getDate()).slice(-2);
                const dateStr = `${y}/${m}/${d}`;

                const prefix = window.currentLang === 'jp' ? '予約可能: ' : 'Check in ';

                // Button shows Earliest Check-in
                btn.innerHTML = `<span style="display:flex; align-items:center; justify-content:center; gap:8px;">${icons.calendar} ${prefix} ${dateStr}</span>`;
                btn.disabled = false;
            } else {
                btn.innerHTML = `<span style="color:#ff6b6b;">${window.currentLang === 'jp' ? '利用不可' : 'Unavailable'}</span>`;
                btn.disabled = true;
            }
        })();
    };

    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('detail-view').classList.remove('active');
        document.body.style.overflow = '';
    });


    // 1.5 Calendar Modal Logic (Beds24)
    const calendarModal = document.createElement('div');
    calendarModal.id = 'calendar-modal';
    calendarModal.className = 'modal-overlay';
    calendarModal.innerHTML = `
        <div class="auth-modal" style="max-width: 800px; width: 90%;"> 
            <h2 class="auth-title" style="margin-bottom: 1rem;">Select Guests and Dates</h2>
            
            <div class="booking-controls" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; background:#222; padding:1rem; border-radius:8px;">
                <div class="guest-selector">
                    <label style="color:#aaa; font-size:0.8rem; display:block; margin-bottom:0.5rem;">Adults</label>
                    <select id="num-adults" style="background:transparent; color:#fff; border:1px solid #444; padding:0.5rem; border-radius:4px; min-width:80px;">
                        ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}" ${i === 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                    </select>
                </div>
                <div class="price-display-container" style="text-align:right;">
                    <span id="price-display" style="font-size:1.5rem; font-weight:bold; color:#fff;">--</span>
                    <div id="price-note" style="font-size:0.75rem; color:#666;">Select dates</div>
                </div>
            </div>
            
            <!-- Price Breakdown Container -->
            <div id="price-breakdown" style="display:none; background:#222; padding:1rem; border-radius:8px; margin-bottom:1.5rem; font-size:0.9rem; color:#ddd;">
                <!-- Populated dynamically -->
            </div>

            <div id="calendar-container" style="display: flex; justify-content: center; margin-bottom: 2rem;"></div>
            
            <div style="text-align: center;">
                <button class="auth-btn primary" id="confirm-dates-btn" disabled>Apply Dates</button>
                <div style="margin-top:1rem; font-size:0.8rem; color:#666; cursor:pointer;" onclick="document.getElementById('calendar-modal').classList.remove('active')">Close</div>
            </div>
        </div>
    `;
    document.body.appendChild(calendarModal);

    window.openAvailabilityCalendar = async (propertyId) => {
        // Find property to get roomId
        const property = window.properties.find(p => p.id === propertyId);
        if (!property || !property.roomId) {
            console.error(`Missing roomId for property ${propertyId}`);
            alert("Configuration Error: Missing Room ID for this property.");
            return;
        }

        const beds24RoomId = property.roomId;
        calendarModal.classList.add('active');
        const container = document.getElementById('calendar-container');
        container.innerHTML = '<div class="loading-spinner">Loading availability...</div>';

        // Reset UI
        document.getElementById('confirm-dates-btn').disabled = true;
        document.getElementById('price-display').innerText = '--';
        document.getElementById('price-note').innerText = 'Select dates to see price';

        // State for this session
        const cachedAvailability = {};
        const formatDate = (d) => d.toISOString().split('T')[0];
        let currentStart = null;
        let currentEnd = null;

        // Helper: Calculate Price
        const calculatePrice = async () => {
            if (!currentStart || !currentEnd) return;

            const numAdults = document.getElementById('num-adults').value;
            const priceEl = document.getElementById('price-display');
            const noteEl = document.getElementById('price-note');
            const btn = document.getElementById('confirm-dates-btn');

            priceEl.innerText = 'Calculating...';
            btn.disabled = true;

            const getLocalISODate = (d) => {
                const z = (n) => ('0' + n).slice(-2);
                return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
            };

            try {
                const startStr = getLocalISODate(currentStart);
                const endStr = getLocalISODate(currentEnd);

                const res = await fetch(`/api/beds24-price?roomId=${beds24RoomId}&arrival=${startStr}&departure=${endStr}&numAdults=${numAdults}`);
                if (!res.ok) {
                    console.error(`[Price API] Error ${res.status}: ${res.statusText}`);
                    throw new Error("Price API not reachable");
                }
                const json = await res.json();
                console.log("[Price API] Success:", json);

                // Logic: Find lowest price offer
                let bestOffer = null;
                if (json.data && json.data.length > 0 && json.data[0].offers && json.data[0].offers.length > 0) {
                    const offers = json.data[0].offers.sort((a, b) => a.price - b.price);
                    bestOffer = offers[0];
                }

                if (bestOffer) {
                    const nights = Math.round((currentEnd - currentStart) / (1000 * 60 * 60 * 24));
                    const total = bestOffer.price;
                    const perNight = Math.round(total / nights);
                    const perPerson = Math.round(total / numAdults);

                    priceEl.innerText = `¥${total.toLocaleString()}`;
                    const offerName = bestOffer.name ? bestOffer.name : '';
                    noteEl.innerText = `${offerName} ${offerName ? '•' : ''} Total for ${nights} night${nights > 1 ? 's' : ''}`;

                    // Render Breakdown
                    const breakdownEl = document.getElementById('price-breakdown');
                    breakdownEl.style.display = 'block';
                    breakdownEl.innerHTML = `
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                            <span>¥${perNight.toLocaleString()} x ${nights} nights</span>
                            <span>¥${total.toLocaleString()}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; color:#aaa; font-size:0.8rem;">
                            <span>Cost per person (${numAdults})</span>
                            <span>¥${perPerson.toLocaleString()}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; border-top:1px solid #444; padding-top:0.5rem; margin-top:0.5rem;">
                            <span>Total (Tax incl.)</span>
                            <span style="font-weight:bold;">¥${total.toLocaleString()}</span>
                        </div>
                    `;

                    btn.disabled = false;

                    // Attach Apply Handler (Redirect Logic Integration)
                    btn.onclick = () => {
                        // 1. Update Widget Fields
                        const checkinEl = document.getElementById(`widget-checkin-${propertyId}`);
                        const checkoutEl = document.getElementById(`widget-checkout-${propertyId}`);
                        const guestsEl = document.getElementById(`widget-guests-${propertyId}`);
                        const mainBtn = document.getElementById(`book-btn-${propertyId}`);

                        // Update Main Price Display
                        const widgetEl = document.getElementById(`booking-widget-${propertyId}`);
                        if (widgetEl) {
                            const priceVal = widgetEl.querySelector('.booking-price');
                            const priceNote = widgetEl.querySelector('.booking-price-note');
                            if (priceVal) priceVal.innerText = `¥${total.toLocaleString()}`;
                            if (priceNote) priceNote.innerText = ` Total for ${nights} nights`;
                        }

                        if (checkinEl) checkinEl.innerText = startStr.replace(/-/g, '/');
                        if (checkoutEl) checkoutEl.innerText = endStr.replace(/-/g, '/');
                        if (guestsEl) guestsEl.innerText = `${numAdults} Guest${numAdults > 1 ? 's' : ''}`;

                        // 2. Update Main Button to Reserve
                        if (mainBtn) {
                            const originalText = window.currentLang === 'jp' ? '予約する' : 'Reserve';
                            mainBtn.innerHTML = `<span>${originalText}</span>`;
                            mainBtn.disabled = false;
                            mainBtn.onclick = (e) => {
                                e.stopPropagation();

                                const bookingData = {
                                    propertyId: property.id,
                                    name: property.name,
                                    location: property.location,
                                    image: property.images[0],
                                    adults: numAdults,
                                    dates: { start: startStr, end: endStr },
                                    dateRangeString: `${startStr.replace(/-/g, '/')} ~ ${endStr.replace(/-/g, '/')}`,
                                    stats: property.details,
                                    prices: { perNight: perNight, nights: nights, total: total }
                                };

                                sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
                                window.location.href = 'checkout.html';
                            };
                        }

                        // 3. Close Modal
                        calendarModal.classList.remove('active');
                    };

                } else {
                    priceEl.innerText = 'Sold Out';
                    noteEl.innerText = 'Not available for these dates';
                    document.getElementById('price-breakdown').style.display = 'none';
                }

            } catch (e) {
                console.error("Price API failed:", e);
                priceEl.innerText = '--';
                noteEl.innerText = 'Unable to calculate price';
            }
        };

        // Wire Guest Selector
        document.getElementById('num-adults').onchange = () => {
            if (currentStart && currentEnd) calculatePrice();
        };

        // Helper to fetch (Real + Mock Fallback)
        const fetchAvailability = async (start, end) => {
            try {
                const res = await fetch(`/api/beds24-availability?roomId=${beds24RoomId}&startDate=${formatDate(start)}&endDate=${formatDate(end)}`);
                if (!res.ok) {
                    console.error(`[Availability API] Error ${res.status}: ${res.statusText}`);
                    throw new Error("API not reachable");
                }
                const json = await res.json();
                console.log("[Availability API] Success:", json);

                if (json.data && json.data.length > 0 && json.data[0].availability) {
                    Object.assign(cachedAvailability, json.data[0].availability);
                }
            } catch (e) {
                console.error("Fetch failed:", e);
            }
        };

        // Initial Load 
        const today = new Date();
        const initialEnd = new Date(today);
        initialEnd.setMonth(today.getMonth() + 2);

        const minStay = property.minStay || 2;

        await fetchAvailability(today, initialEnd);
        renderCalendar(container, cachedAvailability, fetchAvailability, calculatePrice, (s, e) => {
            currentStart = s;
            currentEnd = e;
            // No auto-calculate on load for range mode usually, wait for selection
        }, minStay);
    };

    const renderCalendar = (container, availabilityMap, fetchFn, priceFn, setDatesFn, minStay) => {
        container.innerHTML = '<input type="text" id="date-picker-input" style="display:none;">';

        // Helper: Local YYYY-MM-DD for consistency
        const getLocalISODate = (d) => {
            const z = (n) => ('0' + n).slice(-2);
            return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
        };

        // Find the earliest available date in the availability map
        // This helps determine which dates should be fully disabled
        let earliestAvailableDate = null;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Scan next 90 days to find earliest available date
        for (let i = 0; i < 90; i++) {
            const checkDate = new Date(tomorrow);
            checkDate.setDate(tomorrow.getDate() + i);
            const key = getLocalISODate(checkDate);
            const avail = availabilityMap[key];

            // Check if this date is available
            let isAvail = false;
            if (avail === undefined) {
                isAvail = true; // Default to available if no data
            } else if (typeof avail === 'boolean') {
                isAvail = avail;
            } else if (avail && typeof avail === 'object') {
                if (avail.status == 0) isAvail = false;
                else if ('quantity' in avail) isAvail = parseInt(avail.quantity) > 0;
                else isAvail = true;
            }

            if (isAvail) {
                earliestAvailableDate = new Date(checkDate);
                break;
            }
        }

        console.log('[Calendar] Earliest available date:', earliestAvailableDate ? getLocalISODate(earliestAvailableDate) : 'none found');

        // Strict Bookability Check (Is this night sleepable?)
        const isBookable = (d) => {
            const key = getLocalISODate(d);
            const avail = availabilityMap[key];

            // Default: Assume available if unknown
            if (avail === undefined) return true;
            if (typeof avail === 'boolean') return avail; // true=avail

            if (avail && typeof avail === 'object') {
                // "0" = Closed
                if (avail.status == 0) return false;
                // Quantity <= 0 = Sold Out
                if ('quantity' in avail) {
                    return parseInt(avail.quantity) > 0;
                }
                return true; // Default to open
            }
            return true;
        };

        // Check if a date is before the earliest available check-in
        const isBeforeEarliestCheckin = (d) => {
            if (!earliestAvailableDate) return false;
            // Compare date only (not time)
            const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const earliestDate = new Date(earliestAvailableDate.getFullYear(), earliestAvailableDate.getMonth(), earliestAvailableDate.getDate());
            return dDate < earliestDate;
        };

        // Tooltip Helpers
        let tooltipEl = null;

        const showTooltip = (e, text) => {
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.className = 'calendar-tooltip';
                document.body.appendChild(tooltipEl);
            }
            tooltipEl.innerText = text;
            tooltipEl.style.display = 'block';
            tooltipEl.style.opacity = '1';

            const rect = e.target.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            // Position above the date
            tooltipEl.style.top = (rect.top + scrollY - 40) + 'px'; // 40px up
            tooltipEl.style.left = (rect.left + scrollX + (rect.width / 2) - (tooltipEl.offsetWidth / 2)) + 'px';
        };

        const hideTooltip = () => {
            if (tooltipEl) {
                tooltipEl.style.opacity = '0';
                setTimeout(() => {
                    if (tooltipEl) tooltipEl.style.display = 'none';
                }, 200);
            }
        };

        let fpInstance = null; // Reference to instance
        let firstGapDate = null; // Track the first unavailable date after selection

        const fp = flatpickr("#date-picker-input", {
            inline: true,
            mode: "range",
            minDate: new Date().fp_incr(1), // Block today (Earliest is tomorrow)
            showMonths: 2,
            dateFormat: "Y-m-d",
            appendTo: container,
            disable: [
                (date) => {
                    // Dates before earliest available check-in are always disabled
                    if (isBeforeEarliestCheckin(date)) return true;

                    const currentOk = isBookable(date);

                    // 1. If currently available, always enabled
                    if (currentOk) return false;

                    // 2. Enable Checkout-Only dates (Prev available, current not)
                    // This allows clicking them as an end date.
                    // But ONLY if the previous day is actually after the earliest check-in
                    const prevDate = new Date(date);
                    prevDate.setDate(date.getDate() - 1);

                    // Only allow checkout-only if prev day is bookable AND not before earliest
                    if (isBookable(prevDate) && !isBeforeEarliestCheckin(prevDate)) return false;

                    return true; // Disabled otherwise
                }
            ],
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                // Remove existing events
                dayElem.onmouseenter = null;
                dayElem.onmouseleave = null;
                dayElem.title = ""; // Disable native tooltip

                const date = dayElem.dateObj;

                // Skip processing for dates before earliest available
                if (isBeforeEarliestCheckin(date)) {
                    // These dates should show as unavailable, not checkout-only
                    if (!dayElem.classList.contains("flatpickr-disabled")) {
                        dayElem.classList.add("flatpickr-disabled");
                    }
                    dayElem.addEventListener('mouseenter', (e) => showTooltip(e, "Unavailable"));
                    dayElem.addEventListener('mouseleave', hideTooltip);
                    return;
                }

                let isCheckoutOnly = false;

                // Determine if Checkout Only (Prev Day Available + Current Day Unavailable)
                // This makes it visible BEFORE selection
                const prevDate = new Date(date);
                prevDate.setDate(date.getDate() - 1);

                // Only mark as checkout-only if:
                // 1. Current date is unavailable
                // 2. Previous date is bookable
                // 3. Previous date is NOT before earliest check-in (valid booking window exists)
                if (!isBookable(date) && isBookable(prevDate) && !isBeforeEarliestCheckin(prevDate)) {
                    isCheckoutOnly = true;
                    dayElem.classList.add('avail-checkout-only');
                }

                // Fallback: If dynamically identified as gap during selection
                if (!isCheckoutOnly && firstGapDate &&
                    date.getFullYear() === firstGapDate.getFullYear() &&
                    date.getMonth() === firstGapDate.getMonth() &&
                    date.getDate() === firstGapDate.getDate()) {
                    isCheckoutOnly = true;
                    dayElem.classList.add('avail-checkout-only');
                }

                // Tooltip Logic
                if (isCheckoutOnly) {
                    dayElem.addEventListener('mouseenter', (e) => showTooltip(e, "Check-out only"));
                    dayElem.addEventListener('mouseleave', hideTooltip);
                } else if (dayElem.classList.contains("flatpickr-disabled")) {
                    dayElem.addEventListener('mouseenter', (e) => showTooltip(e, "Unavailable"));
                    dayElem.addEventListener('mouseleave', hideTooltip);
                }
            },
            onChange: (selectedDates, dateStr, instance) => {
                // Assign instance if not yet (though standard way is outside)
                if (!fpInstance) fpInstance = instance;

                // Toggle helper class for CSS (to manage checkout-only hover states)
                if (selectedDates.length > 0) {
                    instance.calendarContainer.classList.add('has-selection');
                } else {
                    instance.calendarContainer.classList.remove('has-selection');
                }

                const btn = document.getElementById('confirm-dates-btn');
                const priceEl = document.getElementById('price-display');
                const noteEl = document.getElementById('price-note');

                // BLOCK CLICKING CHECKOUT-ONLY AS START DATE
                if (selectedDates.length === 1) {
                    const start = selectedDates[0];
                    if (!isBookable(start)) { // If it's technically unbookable (checkout only)
                        // Verify it's not a valid start
                        instance.clear();
                        return; // Stop processing
                    }
                }

                // CALCULATE FIRST GAP DATE ON SINGLE SELECTION
                if (selectedDates.length === 1) {
                    const start = selectedDates[0];
                    let d = new Date(start);
                    d.setDate(d.getDate() + 1); // Start checking from next day

                    // Look ahead for 60 days max to find the first sold-out date
                    let gapFound = null;
                    for (let i = 0; i < 60; i++) {
                        if (!isBookable(d)) {
                            gapFound = new Date(d);
                            break;
                        }
                        d.setDate(d.getDate() + 1);
                    }

                    firstGapDate = gapFound;
                    instance.redraw();
                } else {
                    // Reset if 0 or 2 dates (clean state)
                    if (firstGapDate) {
                        firstGapDate = null;
                        instance.redraw();
                    }
                }

                if (selectedDates.length === 2) {
                    // VALIDATE RANGE CONTENT
                    // Ensure all nights EXCEPT the checkout date are bookable.
                    // Start = selectedDates[0]
                    // End = selectedDates[1]

                    let validRange = true;
                    // Check every night from Start up to (but not including) End
                    const d = new Date(selectedDates[0]);
                    const limit = new Date(selectedDates[1]); // End date

                    while (d < limit) {
                        if (!isBookable(d)) {
                            validRange = false;
                            break;
                        }
                        d.setDate(d.getDate() + 1);
                    }

                    if (!validRange) {
                        instance.clear(); // Clear invalid selection
                        priceEl.innerText = '--';
                        noteEl.innerText = 'One or more selected nights are not available';
                        noteEl.style.color = '#ff6b6b';
                        // Redraw to reset state
                        setTimeout(() => instance.redraw(), 10);
                        return;
                    }

                    const nights = (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24);

                    if (nights < minStay) {
                        btn.disabled = true;
                        priceEl.innerText = '--';
                        noteEl.innerText = `Minimum ${minStay} nights required`;
                        noteEl.style.color = '#ff6b6b';
                    } else {
                        noteEl.style.color = '#666';
                        setDatesFn(selectedDates[0], selectedDates[1]);
                        priceFn();
                    }
                } else {
                    btn.disabled = true;
                    priceEl.innerText = '--';
                    noteEl.innerText = 'Select dates to see price';
                    noteEl.style.color = '#666';
                }
            },
            onMonthChange: async (selectedDates, dateStr, instance) => {
                // When month changes, ensure we have data for the new visible months
                const currentMonth = instance.currentMonth; // 0-indexed
                const currentYear = instance.currentYear;

                // Flatpickr shows 2 months. We need data for (Month) and (Month+1)
                // Let's fetch the range for the *next* likely month to be safe
                const start = new Date(currentYear, currentMonth, 1);
                const end = new Date(currentYear, currentMonth + 3, 0); // End of 3 months from now

                // Optimization: Check if we already have a key in the middle? 
                // Creating a simple heuristics: just fetch. The API is cheap or mocked.

                // Show tiny loader? or just background fetch.
                // Background fetch preferable for smooth UI.

                await fetchFn(start, end);
                instance.redraw();
            }
        });
    };


    // 2. Login Modal Logic - REMOVED
    // Login is now handled by js/auth.js which triggers Google OAuth directly
    // See js/auth.js for implementation

    // Ensure translations are applied to dynamic content
    if (window.updateContent) window.updateContent();

    // --- SHARED LOGIC ---
    // Initialize Card Image State
    window.cardImageState = {};

    // Carousel Handler
    window.changeImage = (e, id, dir) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); // Stop bubbling to card click (detail view)
        }

        const property = window.properties.find(p => p.id === id);
        if (!property || !property.images || property.images.length === 0) return;

        // Init state if needed
        if (!window.cardImageState[id]) window.cardImageState[id] = 0;

        let idx = window.cardImageState[id];

        if (dir === 'next') {
            idx = (idx + 1) % property.images.length;
        } else {
            idx = (idx - 1 + property.images.length) % property.images.length;
        }

        window.cardImageState[id] = idx;

        // Update DOM
        const imgEl = document.getElementById(`card-img-${id}`);
        if (imgEl) {
            imgEl.style.opacity = '0';
            setTimeout(() => {
                imgEl.src = property.images[idx];
                imgEl.onload = () => { imgEl.style.opacity = '1'; };
            }, 200);
        }
    };

    // --- HOME PAGE LOGIC ---
    if (document.body.classList.contains('home-page')) {
        console.log("Initializing Home Page Logic");

        // 1. Scroll Indicator
        // 1. Scroll Indicator - Always visible (CSS handled).

        // 2. Hero Slideshow Logic
        const slideshowContainer = document.getElementById('hero-slideshow');
        if (slideshowContainer && window.properties) {
            // Collect all images
            const allImages = window.properties.flatMap(p => p.images || []);
            // Shuffle
            const shuffled = allImages.sort(() => 0.5 - Math.random());
            // Pick top 5
            const selectedImages = shuffled.slice(0, 5);

            if (selectedImages.length > 0) {
                // Render slides
                slideshowContainer.innerHTML = selectedImages.map((img, index) =>
                    `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${img}');"></div>`
                ).join('');

                // Start Cycle
                const slides = slideshowContainer.querySelectorAll('.hero-slide');
                let currentSlide = 0;

                setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 6000); // 6 seconds per slide
            }
        }

        // 3. Map & Parallax Logic (GUARDED)
        const mapContainer = document.getElementById('mapbox-container');
        window.updateMapPosition = (id) => { }; // Safe default

        // Only try to init map if container exists AND Leaflet is defined
        if (mapContainer && typeof L !== 'undefined') {
            try {
                // Initialize Map
                const map = L.map('mapbox-container', {
                    center: [36.2048, 138.2529],
                    zoom: 5,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    dragging: false, // Locking map to prevent scroll hijacking
                    touchZoom: false,
                    doubleClickZoom: false
                });

                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; OpenStreetMap &copy; CARTO',
                    subdomains: 'abcd',
                    maxZoom: 19
                }).addTo(map);

                const propertyLocations = {
                    1: { lat: 42.863336, lng: 140.696779, zoom: 9 },  // Niseko (Wide)
                    2: { lat: 36.836500, lng: 138.218500, zoom: 10 }, // Hakuba (Regional)
                    3: { lat: 36.820000, lng: 138.230000, zoom: 10 }, // Nozawa (Regional)
                    4: { lat: 35.226800, lng: 139.605300, zoom: 9 },  // Hayama (Wide)
                    5: { lat: 35.000400, lng: 135.772500, zoom: 10 }  // Kyoto (Regional)
                };

                const customIcon = L.divIcon({
                    className: 'custom-pin',
                    html: '<div class="pin-inner"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                Object.keys(propertyLocations).forEach(id => {
                    const loc = propertyLocations[id];
                    const prop = window.properties.find(p => p.id == id);
                    if (prop) {
                        L.marker([loc.lat, loc.lng], { icon: customIcon })
                            .addTo(map)
                            .bindPopup(`<b>${getPropField(prop, 'name')}</b><br>${getPropField(prop, 'location')}`)
                            .on('click', () => window.openProperty(parseInt(id)));
                    }
                });

                // Map Position Global
                window.updateMapPosition = (id) => {
                    if (id === 0) {
                        map.flyTo([36.2048, 138.2529], 5, { duration: 2.0, easeLinearity: 0.5 });
                    } else {
                        const loc = propertyLocations[id];
                        if (loc) {
                            const targetLatLng = L.latLng(loc.lat, loc.lng);
                            const isDesktop = window.innerWidth > 768;
                            if (isDesktop) {
                                // Home Page Logic: Center map based on card position (Left/Right)
                                const index = window.properties.findIndex(p => p.id === id);
                                const isCardLeft = (index % 2 === 0);
                                const zoom = loc.zoom;
                                const point = map.project(targetLatLng, zoom);
                                const mapSize = map.getSize();
                                const centerPoint = point.clone();
                                const quarterWidth = mapSize.x * 0.25;

                                if (isCardLeft) centerPoint.x -= quarterWidth;
                                else centerPoint.x += quarterWidth;

                                const newCenter = map.unproject(centerPoint, zoom);
                                map.flyTo(newCenter, zoom, { duration: 2.0, easeLinearity: 0.5 });
                            } else {
                                map.flyTo(targetLatLng, loc.zoom, { duration: 2.0, easeLinearity: 0.5 });
                            }
                        }
                    }
                };
            } catch (e) {
                console.error("Leaflet Map failed to initialize:", e);
            }
        } else {
            if (!mapContainer) console.warn("Map container missing on Home Page.");
            if (typeof L === 'undefined') console.warn("Leaflet (L) is undefined. Check CDN.");
        }

        // Hero Parallax (Removed Legacy #japan-map logic)

        // Observers
        const observerOptions = { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 };
        window.cardScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.dataset.id;
                    if (id) {
                        window.updateMapPosition(parseInt(id));
                    }
                }
            });
        }, observerOptions);

        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) window.updateMapPosition(0);
        }, { threshold: 0.75 });

        const hero = document.querySelector('.welcome-section');
        if (hero) heroObserver.observe(hero);



        // 3. Render Home Cards (Centered Stack) via createCard
        // UPDATED FOR I18N
        window.createCard = (property) => {
            const name = getPropField(property, 'name');
            const description = getPropField(property, 'description');
            const location = getPropField(property, 'location');
            const bedLabel = window.currentLang === 'jp' ? 'ベッド' : 'Beds';
            const guestLabel = window.currentLang === 'jp' ? '定員' : 'Guests';
            const bathLabel = window.currentLang === 'jp' ? '風呂' : 'Baths';

            return `
        <div onclick="openProperty(${property.id})" data-id="${property.id}" class="property-card" style="cursor: pointer;">
            <div class="card-image-wrapper loading">
                <img id="card-img-${property.id}" src="${property.images && property.images.length > 0 ? property.images[0] : 'placeholder.jpg'}" alt="${name}" class="card-image" loading="lazy" onload="this.classList.add('loaded'); this.parentElement.classList.remove('loading');">
                
                <!-- Carousel Controls -->
                <button class="carousel-btn prev" onclick="event.stopPropagation(); window.changeImage(event, ${property.id}, 'prev')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button class="carousel-btn next" onclick="event.stopPropagation(); window.changeImage(event, ${property.id}, 'next')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                
                <!-- Availability Badge with Loading Animation -->
                <div class="availability-badge loading" data-badge-id="${property.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; backdrop-filter: blur(4px); display: flex; letter-spacing: 0.05em; font-weight: 500; min-width: 50px; justify-content: center;">
                    <span class="loading-dots"><span></span><span></span><span></span></span>
                </div>
            </div>

            <div class="card-info">
                <span class="location" style="display:block; margin-bottom:0.5rem; color:var(--accent-color); letter-spacing:0.2em; font-size:0.75rem; text-transform:uppercase;">${location}</span>
                <h3 style="margin-bottom:1rem; font-family:var(--font-display); display:flex; align-items:center;">
                    ${name}
                    ${property.instagram ? `
                    <a href="${property.instagram}" target="_blank" class="insta-btn" onclick="event.stopPropagation()">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>` : ''}
                </h3>
                <p style="color:#999; margin-bottom:2rem; max-width:600px; font-weight:300;">${description.substring(0, 100)}...</p>
                
                <div class="card-stats" style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1.5rem; gap:2rem;">
                    <span style="display:flex; align-items:center; gap:0.5rem; font-weight:300;">${icons.bed} ${property.details.bedrooms} ${bedLabel}</span>
                    <span style="opacity:0.3;">|</span>
                    <span style="display:flex; align-items:center; gap:0.5rem; font-weight:300;">${icons.guests} ${property.details.guests} ${guestLabel}</span>
                    <span style="opacity:0.3;">|</span>
                    <span style="display:flex; align-items:center; gap:0.5rem; font-weight:300;">${icons.bath} ${property.details.bath} ${bathLabel}</span>
                </div>
            </div>
        </div>
        `};




        const grid = document.getElementById('featured-grid');
        if (grid && window.properties) {
            grid.innerHTML = window.properties.map(window.createCard).join('');

            // Trigger update after render
            setTimeout(() => window.updateCardAvailability(), 100);

            // Attach observers after render
            setTimeout(() => {
                const cards = document.querySelectorAll('.property-card');
                cards.forEach(c => {
                    if (window.cardScrollObserver) window.cardScrollObserver.observe(c);
                    c.classList.add('visible'); // Initial fade in needed for CSS opacity transition
                });
            }, 200);
        }
    }

    // --- DESTINATIONS PAGE LOGIC ---
    if (document.body.classList.contains('stays-page')) {
        console.log("Initializing Destinations Page Logic");

        const filterBar = document.getElementById('filter-bar');
        const propertyList = document.getElementById('property-list');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (filterBar && propertyList && window.properties) {
            let activeFilter = 'all';

            window.updatePropertyList = () => {
                propertyList.innerHTML = "";

                const list = (activeFilter === 'all')
                    ? window.properties
                    : window.properties.filter(p => p.features && p.features.some(f => f.toLowerCase() === activeFilter.toLowerCase()));

                if (list.length === 0) {
                    propertyList.innerHTML = '<div style="padding:4rem; text-align:center; color:#888;">No properties found for this category.</div>';
                    return;
                }

                list.forEach(p => {
                    // Localize fields for Stays Page
                    const name = getPropField(p, 'name');
                    const description = getPropField(p, 'description');
                    const location = getPropField(p, 'location');
                    const bedLabel = window.currentLang === 'jp' ? 'ベッド' : 'Beds';
                    const guestLabel = window.currentLang === 'jp' ? '定員' : 'Guests';
                    const bathLabel = window.currentLang === 'jp' ? '風呂' : 'Baths';

                    propertyList.innerHTML += `
                    <div class="property-list-item visible" onclick="openProperty(${p.id})">
                        <div class="list-img-wrapper loading">
                            <img id="card-img-${p.id}" src="${p.images && p.images.length > 0 ? p.images[0] : 'placeholder.jpg'}" 
                                 alt="${name}" 
                                 class="list-img card-image" loading="lazy"
                                 onload="this.classList.add('loaded'); this.parentElement.classList.remove('loading');">
                            
                            <!-- Carousel Controls -->
                            <button class="carousel-btn prev" onclick="event.stopPropagation(); window.changeImage(event, ${p.id}, 'prev')">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <button class="carousel-btn next" onclick="event.stopPropagation(); window.changeImage(event, ${p.id}, 'next')">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                            
                            <!-- Availability Badge with Loading Animation -->
                            <div class="availability-badge loading" data-badge-id="${p.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; backdrop-filter: blur(4px); display: flex; letter-spacing: 0.05em; font-weight: 500; min-width: 50px; justify-content: center;">
                                <span class="loading-dots"><span></span><span></span><span></span></span>
                            </div>
                        </div>
                        <div class="list-content">
                            <span class="list-region">${location.toUpperCase()}</span>
                            <h3 class="list-title">
                                ${name}
                                ${p.instagram ? `
                                <a href="${p.instagram}" target="_blank" class="insta-btn" onclick="event.stopPropagation()">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>` : ''}
                            </h3>
                            <p class="list-desc">${description}</p>
                            
                            <div class="flex-between" style="padding-top:0;">
                                 <div class="card-stats" style="font-size: 0.85rem; color: #fff; opacity: 0.9; font-weight: 300; border-top:1px solid rgba(255,255,255,0.1); padding-top: 0.5rem; width:100%;">
                                    <span style="display:flex; align-items:center; gap:0.4rem;">${icons.bed} ${p.details.bedrooms} <span class="stat-label">${bedLabel}</span></span>
                                    <span style="margin: 0 0.5rem; opacity:0.4;">|</span>
                                    <span style="display:flex; align-items:center; gap:0.4rem;">${icons.guests} ${p.details.guests} <span class="stat-label">${guestLabel}</span></span>
                                    <span style="margin: 0 0.5rem; opacity:0.4;">|</span>
                                    <span style="display:flex; align-items:center; gap:0.4rem;">${icons.bath} ${p.details.bath} <span class="stat-label">${bathLabel}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                });

                // Trigger batch update
                setTimeout(() => window.updateCardAvailability(), 100);

                // Clear Filter Button Logic
                if (clearFiltersBtn) {
                    clearFiltersBtn.classList.remove('visible');
                    clearFiltersBtn.style.opacity = '0';
                    clearFiltersBtn.style.pointerEvents = 'none';
                }
            };

            // Listeners
            const btns = filterBar.querySelectorAll('button[data-filter]');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const f = btn.getAttribute('data-filter');

                    // Update UI state
                    btns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Set filter
                    activeFilter = f;
                    window.updatePropertyList();
                });
            });

            // Handle URL params or initial state if needed, but for now just render
            window.updatePropertyList();
        }
    }

};
