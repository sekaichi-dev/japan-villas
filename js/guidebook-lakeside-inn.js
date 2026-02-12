/**
 * Guest Guidebook - JavaScript
 * Handles accordion functionality, navigation, and data rendering
 * Supports bilingual content (EN/JP)
 */

// Initialize language state
window.currentLang = localStorage.getItem('siteLang') || 'en';

// WiFi QR Accordion Logic
window.toggleWifiQr = function (qrId) {
    const target = document.getElementById(qrId);
    const allPanels = document.querySelectorAll('.wifi-qr-panel');

    // Check if specifically this one is already open
    const isAlreadyOpen = target.classList.contains('active');

    // Close all first
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // If it wasn't open, open it now (toggle)
    if (!isAlreadyOpen) {
        target.classList.add('active');
    }
};

// ============================================
// ICONS (Monochrome SVG)
// ============================================
const ICONS = {
    // Access
    address: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    parking: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
    car: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>',
    train: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    taxi: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',

    // Facilities
    checkin: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>',
    water: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
    amenities: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>',
    kitchen: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    bath: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M9 21h6"></path><path d="M5 21a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5z"></path></svg>', // Using generic tub/container shape or can use "cloud-drizzle"
    dishes: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
    condiments: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>', // Tag icon
    rentals: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>', // Zoom/Explore or similar
    ac: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>',
    wifi: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>',
    rooms: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    trash: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',

    // Neighborhood
    goods: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    sightseeing: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    restaurant: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',

    // Rules
    cancel: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    smoke: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>', // Ban sign
    noise: '<svg class="icon-inline" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>', // Mute/No Loud
    damage: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    time: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    money: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',

    // FAQ
    luggage: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    power: '<svg class="icon-inline" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    receipt: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',

    // Paid Services
    sup: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M3 18h18M12 6v8M8 10l4-4 4 4"></path><ellipse cx="12" cy="18" rx="9" ry="2"></ellipse></svg>',
    bbq: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="10" r="7"></circle><path d="M12 17v4M8 21h8M9 7v3M12 6v4M15 7v3"></path></svg>',
    clock: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    bicycle: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h3"></path></svg>',
    fishing: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M18 3v7c0 2.21-1.79 4-4 4h-2l-2 3-2-3H6c-2.21 0-4-1.79-4-4V3M12 14v7M10 21h4"></path></svg>',
    fire: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 22c-4.97 0-9-4.03-9-9 0-4 4-8 4-12 0 0 3 2 4 6 1.5-2 2-4 2-4s3 2.5 3 6c2-1 3-2.5 3-2.5s2 3.5 2 6.5c0 4.97-4.03 9-9 9z"></path></svg>',

    // Missing Icons
    tv: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
    mic: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
    laundry: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><path d="M12 18a5 5 0 0 1-5-5"></path></svg>',
    rules: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
    info: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    check: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    phone: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    help: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
};

// ============================================
// GUIDEBOOK DATA STRUCTURE (Bilingual)
// ============================================
const guidebookData = window.guidebookData = {
    propertyId: "557548",
    propertyName: "LAKE SIDE INN Nojiriko",
    heroImage: "img/lakesideinn/main.jpg",
    // Access Section (Bilingual) - Now as items array
    access: {
        id: "access",
        title: { en: "Access & WiFi", jp: "アクセス ＆ WiFi" },
        items: [
            {
                icon: "checkin",
                title: { en: "Check-in Guide", jp: "チェックイン・アウト方法" },
                content: {
                    en: `<p>Open the key box on the door using the code <strong>0123</strong>.</p>
                        <div class="keybox-container">
                            <img src="img/lakesideinn/checkin_exterior.jpg" alt="Keybox Location" class="guidebook-img" style="aspect-ratio: 4/3; object-fit: cover;">
                            <img src="img/lakesideinn/checkin_keybox.jpg" alt="Keybox Detail" class="guidebook-img" style="aspect-ratio: 4/3; object-fit: cover; object-position: 95% 85%;">
                        </div>`,
                    jp: `<p><strong>17:00までに到着される場合</strong><br>
                        敷地内に併設しているカフェにてチェックインをお願いいたします。<br>
                        ※毎週火曜日は定休日のため、カフェでのチェックインはできません。<br><br>
                        <strong>17:00以降、または火曜日に到着される場合</strong><br>
                        セルフチェックインとなります。<br>
                        玄関ドアのドアノブに設置されているキーボックスをご利用ください。<br>
                        暗証番号は棟ごとに異なり、事前にチャットまたはメールでご案内しております。<br><br>
                        <strong>チェックアウト時</strong><br>
                        ご使用後の鍵はキーボックスへお戻しください。</p>
                        <div class="keybox-container">
                            <img src="img/lakesideinn/checkin_exterior.jpg" alt="キーボックスの場所" class="guidebook-img" style="aspect-ratio: 4/3; object-fit: cover;">
                            <img src="img/lakesideinn/checkin_keybox.jpg" alt="キーボックス詳細" class="guidebook-img" style="aspect-ratio: 4/3; object-fit: cover; object-position: 95% 85%;">
                        </div>`
                }
            },
            {
                icon: "wifi",
                title: { en: "WiFi", jp: "WiFi" },
                content: {
                    en: `<style>
                            .custom-wifi-section .wifi-row {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px 0;
                                border-bottom: 1px solid rgba(255,255,255,0.1);
                            }
                            .custom-wifi-section .wifi-row:last-child {
                                border-bottom: none;
                            }
                            .custom-wifi-section .wifi-info {
                                font-size: 0.95rem;
                                line-height: 1.5;
                                color: #fff;
                            }
                            .custom-wifi-section .wifi-qr-btn {
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255,255,255,0.2);
                                color: #fff;
                                padding: 6px 14px;
                                border-radius: 20px;
                                font-size: 0.8rem;
                                cursor: pointer;
                                transition: all 0.2s;
                                white-space: nowrap;
                                margin-left: 12px;
                            }
                            .custom-wifi-section .wifi-qr-btn:hover {
                                background: rgba(255,255,255,0.25);
                            }
                            .wifi-qr-panel {
                                display: none;
                                margin-top: 10px;
                                padding: 10px;
                                background: #fff;
                                border-radius: 8px;
                                text-align: center;
                                width: 100%;
                                max-width: 240px;
                                margin-left: auto;
                                margin-right: auto;
                            }
                            .wifi-qr-panel.active {
                                display: block;
                                animation: fadeIn 0.3s ease;
                            }
                            .wifi-qr-img {
                                width: 100%;
                                height: auto;
                                display: block;
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(-5px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        </style>
                        <div class="custom-wifi-section">
                            <!-- 1 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn1<br>
                                        <strong>Password:</strong> NojiriLake-1
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-1')">Show QR</button>
                                </div>
                                <div id="wifi-qr-1" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_1.png" alt="WiFi QR 1" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 2 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-2<br>
                                        <strong>Password:</strong> NomadWagon-2
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-2')">Show QR</button>
                                </div>
                                <div id="wifi-qr-2" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_2.png" alt="WiFi QR 2" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 3 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-3<br>
                                        <strong>Password:</strong> Lakeside Camper-3
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-3')">Show QR</button>
                                </div>
                                <div id="wifi-qr-3" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_3.png" alt="WiFi QR 3" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 4 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-4<br>
                                        <strong>Password:</strong> RoamCabin-4
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-4')">Show QR</button>
                                </div>
                                <div id="wifi-qr-4" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_4.png" alt="WiFi QR 4" class="wifi-qr-img">
                                </div>
                            </div>
                        </div>`,
                    jp: `<style>
                            .custom-wifi-section .wifi-row {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px 0;
                                border-bottom: 1px solid rgba(255,255,255,0.1);
                            }
                            .custom-wifi-section .wifi-row:last-child {
                                border-bottom: none;
                            }
                            .custom-wifi-section .wifi-info {
                                font-size: 0.95rem;
                                line-height: 1.5;
                                color: #fff;
                            }
                            .custom-wifi-section .wifi-qr-btn {
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255,255,255,0.2);
                                color: #fff;
                                padding: 6px 14px;
                                border-radius: 20px;
                                font-size: 0.8rem;
                                cursor: pointer;
                                transition: all 0.2s;
                                white-space: nowrap;
                                margin-left: 12px;
                            }
                            .custom-wifi-section .wifi-qr-btn:hover {
                                background: rgba(255,255,255,0.25);
                            }
                            .wifi-qr-panel {
                                display: none;
                                margin-top: 10px;
                                padding: 10px;
                                background: #fff;
                                border-radius: 8px;
                                text-align: center;
                                width: 100%;
                                max-width: 240px;
                                margin-left: auto;
                                margin-right: auto;
                            }
                            .wifi-qr-panel.active {
                                display: block;
                                animation: fadeIn 0.3s ease;
                            }
                            .wifi-qr-img {
                                width: 100%;
                                height: auto;
                                display: block;
                                border-radius: 4px;
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(-5px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        </style>
                        <div class="custom-wifi-section">
                            <!-- 1 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn1<br>
                                        <strong>Password:</strong> NojiriLake-1
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-1-jp')">こちら（QR）</button>
                                </div>
                                <div id="wifi-qr-1-jp" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_1.png" alt="WiFi QR 1" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 2 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-2<br>
                                        <strong>Password:</strong> NomadWagon-2
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-2-jp')">こちら（QR）</button>
                                </div>
                                <div id="wifi-qr-2-jp" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_2.png" alt="WiFi QR 2" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 3 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-3<br>
                                        <strong>Password:</strong> Lakeside Camper-3
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-3-jp')">こちら（QR）</button>
                                </div>
                                <div id="wifi-qr-3-jp" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_3.png" alt="WiFi QR 3" class="wifi-qr-img">
                                </div>
                            </div>
                            <!-- 4 -->
                            <div class="wifi-item">
                                <div class="wifi-row">
                                    <div class="wifi-info">
                                        <strong>SSID:</strong> lake-side-lnn-4<br>
                                        <strong>Password:</strong> RoamCabin-4
                                    </div>
                                    <button class="wifi-qr-btn" onclick="toggleWifiQr('wifi-qr-4-jp')">こちら（QR）</button>
                                </div>
                                <div id="wifi-qr-4-jp" class="wifi-qr-panel">
                                    <img src="img/lakesideinn/wifi_qr_4.png" alt="WiFi QR 4" class="wifi-qr-img">
                                </div>
                            </div>
                        </div>`
                }
            },
            {
                icon: "address",
                title: { en: "Address", jp: "住所" },
                content: {
                    en: `<div class="address-row">
                            <span class="address-text">54-3 Nojiri, Shinano-machi, Kamiminochi-gun, Nagano-ken</span>
                            <a href="https://maps.app.goo.gl/WKKEfmXAJ3Xa4vN19" target="_blank" rel="noopener noreferrer" class="maps-external-link">📍 Open in Google Maps</a>
                        </div>
                        <div class="map-embed">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1597.2!2d138.20995!3d36.82944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601d9b5ed77c4f59%3A0x8e2c30c5d3c5f3d8!2z6ZW36YeO55yM5LiK5rC05YaF6YOh5L-h5r-D55S66YeO5bC7NTTigJAz!5e0!3m2!1sja!2sjp!4v1699000000000" 
                                width="100%" 
                                height="250" 
                                style="border:0; border-radius: 8px;" 
                                allowfullscreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>`,
                    jp: `<div class="address-row">
                            <span class="address-text">長野県上水内郡信濃町野尻54-3</span>
                            <a href="https://maps.app.goo.gl/WKKEfmXAJ3Xa4vN19" target="_blank" rel="noopener noreferrer" class="maps-external-link">📍 Google Mapsで開く</a>
                        </div>
                        <div class="map-embed">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1597.2!2d138.20995!3d36.82944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601d9b5ed77c4f59%3A0x8e2c30c5d3c5f3d8!2z6ZW36YeO55yM5LiK5rC05YaF6YOh5L-h5r-D55S66YeO5bC7NTTigJAz!5e0!3m2!1sja!2sjp!4v1699000000000" 
                                width="100%" 
                                height="250" 
                                style="border:0; border-radius: 8px;" 
                                allowfullscreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>`
                }
            },
            {
                icon: "parking",
                title: { en: "Parking", jp: "駐車場" },
                content: {
                    en: `<p>One car per cabin is allowed by default.<br>
                        If you plan to park two or more cars, please contact us in advance via the chat on the booking platform you used.</p>
                        <img src="img/lakesideinn/parking_photo.jpg" alt="Parking Area" class="guidebook-img" style="margin-top: 10px;">`,
                    jp: `<p>原則、1棟につきお車1台までとなります。<br>
                        2台以上で来られる場合は、事前に予約サイト内のチャットにてご連絡ください。</p>
                        <img src="img/lakesideinn/parking_photo.jpg" alt="駐車場写真" class="guidebook-img" style="margin-top: 10px;">`
                }
            },
            {
                icon: "car",
                title: { en: "By Car", jp: "車で来る場合" },
                content: {
                    en: `<p>・Approx. 5 min by car from "Nojiriko IC" on Joshinetsu Expressway.<br>
                        ・Approx. 40 min by car from Nagano Station.<br>
                        ・Car rentals are available around Nagano Station, making it convenient for train travelers.</p>`,
                    jp: `<p>・上信越自動車道「野尻湖IC」から車で約5分。<br>
                        ・長野駅からは車で約40分と、アクセスも良好です。<br>
                        ・長野駅周辺ではレンタカーの手配も可能なので、電車でお越しの方も安心してご利用いただけます。</p>`
                }
            },
            {
                icon: "train",
                title: { en: "By Train", jp: "電車で来る場合" },
                content: {
                    en: `<p>・From Nagano Station, take the Shinano Railway Kita-Shinano Line for approximately 35 minutes.<br>
                        ・After arriving at Kurohime Station, please take a taxi to the property.</p>`,
                    jp: `<p>・長野駅よりしなの鉄道北しなの線で約35分。<br>
                        ・黒姫駅到着後は、タクシーをご利用ください。</p>`
                }
            },
            {
                icon: "taxi",
                title: { en: "Taxi Companies (Japanese only)", jp: "タクシー会社" },
                content: {
                    en: `<p><strong>Nojiriko Taxi:</strong> <a href="tel:026-219-2829" class="phone-link" style="color: inherit; text-decoration: none;">026-219-2829</a></p>
                        <p><strong>Toriigawa Kanko Taxi:</strong> <a href="tel:026-255-3155" class="phone-link" style="color: inherit; text-decoration: none;">026-255-3155</a></p>`,
                    jp: `<p><strong>野尻湖タクシー（株）:</strong> <a href="tel:026-219-2829" class="phone-link" style="color: inherit; text-decoration: none;">026−219−2829</a></p>
                        <p><strong>鳥居川観光タクシー（株）:</strong> <a href="tel:026-255-3155" class="phone-link" style="color: inherit; text-decoration: none;">026−255−3155</a></p>`
                }
            }
        ]
    },

    // Main Guide Sections
    sections: [
        {
            id: "facility",
            title: { en: "Room & Equipment Guide", jp: "各部屋と備品のご案内" },
            items: [
                {
                    id: "loft",
                    icon: "rooms",
                    title: { en: "Loft", jp: "ロフト" },
                    content: {
                        en: `<p>The loft area is equipped with two single-size mattresses.</p>
                             <img src="img/lakesideinn/loft.jpg" alt="Loft" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`,
                        jp: `<p>ロフトエリアには、シングルサイズのマットレスを2台ご用意しております。</p>
                             <img src="img/lakesideinn/loft.jpg" alt="ロフト" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`
                    }
                },
                {
                    id: "living",
                    icon: "tv",
                    title: { en: "Living Room", jp: "リビング" },
                    content: {
                        en: `<p>An open living room equipped with a dining table and bench sofa.<br>Natural light pours in, allowing you to comfortably enjoy meals and family time.</p>
                             <img src="img/lakesideinn/living.jpg" alt="Living Room" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`,
                        jp: `<p>ダイニングテーブルとベンチソファを備えた開放的なリビング。<br>自然光が差し込み、食事や団らんの時間を快適にお楽しみいただけます。</p>
                             <img src="img/lakesideinn/living.jpg" alt="リビング" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`
                    }
                },
                {
                    id: "bedroom",
                    icon: "rooms",
                    title: { en: "Bedroom", jp: "ベッドルーム" },
                    content: {
                        en: `<p>A bedroom with two semi-double beds. A spacious and calm space where you can sleep comfortably.</p>
                             <img src="img/lakesideinn/bedroom.jpg" alt="Bedroom" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`,
                        jp: `<p>セミダブルベッド2台を備えた寝室。ゆとりある配置で、快適にお休みいただける落ち着いた空間です。</p>
                             <img src="img/lakesideinn/bedroom.jpg" alt="ベッドルーム" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`
                    }
                },
                {
                    id: "kitchen",
                    icon: "kitchen",
                    title: { en: "Kitchen", jp: "キッチン" },
                    content: {
                        en: `<style>
                                .compact-guide-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-bottom: 0.5rem;
                                }
                                .compact-guide-list li {
                                    margin-bottom: 4px;
                                    line-height: 1.4;
                                    font-size: 0.95rem;
                                }
                             </style>
                             <h4 class="guide-sub-title">Basic Usage</h4>
                             <img src="img/lakesideinn/kitchen_ih.jpg" alt="IH Stove" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <details class="living-accordion">
                                 <summary>① Place the Pot</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Place an IH-compatible pot or pan in the center of the heating circle.</li>
                                     <li>・Do not heat the pot empty.</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>② Power On</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Press the "OFF/START" button at the bottom of the control panel.</li>
                                     <li>・The indicator light will turn on.</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>③ Select Heating Area</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Press the "OFF/START" button for the area you want to use.</li>
                                     <li>・The left or right heater will be selected.</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>④ Adjust Heat Level</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Use the "<" or ">" buttons to adjust the heat level.</li>
                                     <li>・Higher numbers indicate stronger heat.</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>⑤ Stop Cooking</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Press the "OFF/START" button to stop heating.</li>
                                     <li>・Remove the pot after use.</li>
                                 </ul>
                             </details>

                             <h4 class="guide-sub-title">Grill Usage</h4>
                             <img src="img/lakesideinn/kitchen_grill.jpg" alt="Fish Grill" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <details class="living-accordion">
                                 <summary>① Select Menu</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Press the "Menu" button to select a cooking mode (Fish, Toast, etc.).</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>② Start</summary>
                                 <ul class="compact-guide-list">
                                     <li>・After confirming, press the "OFF/START" button.</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>③ Finish</summary>
                                 <ul class="compact-guide-list">
                                     <li>・Heating will stop automatically when finished.</li>
                                     <li>・Be careful of the high temperature when removing items.</li>
                                 </ul>
                             </details>

                             <h4 class="guide-sub-title gold-underline">Safety Precautions</h4>
                             <ul class="guide-list">
                                 <li>The top surface may be hot after use.</li>
                                 <li>Please ensure small children do not operate it.</li>
                                 <li>Do not place metal objects like spoons or aluminum foil on the surface.</li>
                             </ul>`,
                        jp: `<style>
                                .compact-guide-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-bottom: 0.5rem;
                                }
                                .compact-guide-list li {
                                    margin-bottom: 4px;
                                    line-height: 1.4;
                                    font-size: 0.95rem;
                                }
                             </style>
                             <h4 class="guide-sub-title">基本の使い方</h4>
                             <img src="img/lakesideinn/kitchen_ih.jpg" alt="IHコンロ" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <details class="living-accordion">
                                 <summary>① 鍋を置く</summary>
                                 <ul class="compact-guide-list">
                                     <li>・IH対応の鍋またはフライパンを、加熱したい円の中央に置いてください。</li>
                                     <li>・鍋は空焚きしないでください。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>② 電源を入れる</summary>
                                 <ul class="compact-guide-list">
                                     <li>・操作パネル下部の「切／スタート」ボタンを押します。</li>
                                     <li>・操作ランプが点灯します。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>③ 加熱する場所を選ぶ</summary>
                                 <ul class="compact-guide-list">
                                     <li>・使用したい加熱エリアの「切／スタート」ボタンを押します。</li>
                                     <li>・左側または右側のヒーターが選択されます。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>④ 火力を調整する</summary>
                                 <ul class="compact-guide-list">
                                     <li>・「＜」または「＞」ボタンで火力を調整します。</li>
                                     <li>・数字が大きいほど火力が強くなります。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>⑤ 調理を終了する</summary>
                                 <ul class="compact-guide-list">
                                     <li>・調理が終わったら「切／スタート」ボタンを押して加熱を止めてください。</li>
                                     <li>・使用後は鍋を外してください。</li>
                                 </ul>
                             </details>

                             <h4 class="guide-sub-title">グリルの使い方</h4>
                             <img src="img/lakesideinn/kitchen_grill.jpg" alt="魚焼きグリル" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <details class="living-accordion">
                                 <summary>① メニューを選ぶ</summary>
                                 <ul class="compact-guide-list">
                                     <li>・「メニュー」ボタンを押して調理モードを選びます。</li>
                                     <li>・魚焼き、トーストなどの自動メニューがあります。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>② スタート</summary>
                                 <ul class="compact-guide-list">
                                     <li>・内容を確認後「切／スタート」ボタンを押します。</li>
                                 </ul>
                             </details>
                             <details class="living-accordion">
                                 <summary>③ 終了</summary>
                                 <ul class="compact-guide-list">
                                     <li>・加熱終了後は自動で停止します。</li>
                                     <li>・高温になるため、取り出す際はご注意ください。</li>
                                 </ul>
                             </details>

                             <h4 class="guide-sub-title gold-underline">安全上の注意</h4>
                             <ul class="guide-list">
                                 <li>使用後は天板が熱くなっている場合があります。</li>
                                 <li>小さなお子様が操作しないようご注意ください。</li>
                                 <li>金属製のスプーンやアルミホイルは置かないでください。</li>
                             </ul>`
                    }
                },
                {
                    id: "cookware",
                    icon: "dishes",
                    title: { en: "Cookware", jp: "調理器具" },
                    content: {
                        en: `<style>
                                .compact-guide-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-bottom: 0.8rem;
                                }
                                .compact-guide-list li {
                                    margin-bottom: 2px;
                                    line-height: 1.4;
                                    font-size: 0.95rem;
                                }
                             </style>
                             <h4 class="guide-sub-title">① Tableware & Drinkware</h4>
                             <ul class="compact-guide-list">
                                 <li>・Plates</li>
                                 <li>・Cups</li>
                                 <li>・Electric Kettle</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_tableware.jpg" alt="Tableware" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">② Cutlery</h4>
                             <ul class="compact-guide-list">
                                 <li>・Spoons</li>
                                 <li>・Forks</li>
                                 <li>・Knives</li>
                                 <li>・Chopsticks</li>
                                 <li>・Measuring Spoons</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_cutlery.jpg" alt="Cutlery" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">③ Cooking Utensils</h4>
                             <ul class="compact-guide-list">
                                 <li>・Kitchen Knives</li>
                                 <li>・Scissors</li>
                                 <li>・Frying Pan</li>
                                 <li>・Pot (Small size)</li>
                                 <li>・Bowls</li>
                                 <li>・Tongs</li>
                                 <li>・Ladle</li>
                                 <li>・Spatula</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_utensils.jpg" alt="Cooking Utensils" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">④ Home Appliances</h4>
                             <ul class="compact-guide-list">
                                 <li>・Microwave</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_microwave.jpg" alt="Microwave" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">`,
                        jp: `<style>
                                .compact-guide-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-bottom: 0.8rem;
                                }
                                .compact-guide-list li {
                                    margin-bottom: 2px;
                                    line-height: 1.4;
                                    font-size: 0.95rem;
                                }
                             </style>
                             <h4 class="guide-sub-title">① 食器・ドリンク用品</h4>
                             <ul class="compact-guide-list">
                                 <li>・皿</li>
                                 <li>・コップ</li>
                                 <li>・電気ケトル</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_tableware.jpg" alt="食器・ドリンク用品" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">② カトラリー</h4>
                             <ul class="compact-guide-list">
                                 <li>・スプーン</li>
                                 <li>・フォーク</li>
                                 <li>・ナイフ</li>
                                 <li>・箸</li>
                                 <li>・計量スプーン</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_cutlery.jpg" alt="カトラリー" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">③ 調理器具</h4>
                             <ul class="compact-guide-list">
                                 <li>・包丁</li>
                                 <li>・鋏</li>
                                 <li>・フライパン</li>
                                 <li>・鍋（小さめ）</li>
                                 <li>・ボウル</li>
                                 <li>・トング</li>
                                 <li>・お玉</li>
                                 <li>・フライ返し</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_utensils.jpg" alt="調理器具" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto 1.5rem; border-radius: 6px;">

                             <h4 class="guide-sub-title">④ 家電</h4>
                             <ul class="compact-guide-list">
                                 <li>・電子レンジ</li>
                             </ul>
                             <img src="img/lakesideinn/cookware_microwave.jpg" alt="電子レンジ" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">`
                    }
                },
                {
                    id: "water-facilities",
                    icon: "water",
                    title: { en: "Water Facilities", jp: "水回り（洗面・トイレ・シャワー）" },
                    content: {
                        en: `<p>A space equipped with a washroom, toilet, and shower. It is a clean and calm space where you can spend your time comfortably.</p>
                             
                             <h4 class="guide-sub-title">1. Washroom</h4>
                             <img src="img/lakesideinn/washroom.jpg" alt="Washroom" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>A washroom space with a washbasin and a wide counter. Designed for convenience in daily use such as grooming and skin care.</p>
                             <p>※ Hair dryer and hand soap are available.</p>

                             <h4 class="guide-sub-title">2. Toilet</h4>
                             <p>A clean Western-style toilet. You can use it with peace of mind during your stay.</p>
                             <p>※ Please do not flush anything other than toilet paper.</p>

                             <h4 class="guide-sub-title">3. Shower & Bath</h4>
                             <img src="img/lakesideinn/shower.jpg" alt="Shower" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>A bath space with shower facilities. You can relax and heal the fatigue of the day.</p>
                             
                             <div style="margin: 1.5rem 0; width: 45%; border-radius: 6px; overflow: hidden; border: 1px solid #ddd;">
                                 <img src="img/lakesideinn/water_heater_panel_en.jpg" alt="Water Heater Control Panel" loading="lazy" style="width: 100%; display: block;">
                             </div>
                             <p style="font-size: 0.85rem; margin-top: -1rem; margin-bottom: 1.5rem; line-height: 1.4; color: #ccc;">
                                 <strong>Water Heater Control Panel</strong><br>
                                 Use this panel to adjust the water temperature.
                             </p>

                             <p>※ Please cooperate in ventilation after use.<br>
                                ※ Room temperature may drop in winter.</p>`,
                        jp: `<p>洗面所・トイレ・シャワーを備えた水回りスペースです。<br>清潔感のある落ち着いた空間で、快適にご利用いただけます。</p>
                             
                             <h4 class="guide-sub-title">① 洗面所</h4>
                             <img src="img/lakesideinn/washroom.jpg" alt="洗面所" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>洗面ボウルと広めのカウンターを備えた洗面スペースです。<br>身支度やスキンケアなど、日常使いに便利な設計となっています。</p>
                             <p>※ ドライヤー・ハンドソープをご用意しています。</p>

                             <h4 class="guide-sub-title">② トイレ</h4>
                             <p>清潔に保たれた洋式トイレです。<br>ご滞在中、安心してご利用いただけます。</p>
                             <p>※ トイレットペーパー以外のものは流さないようお願いいたします。</p>

                             <h4 class="guide-sub-title">③ シャワー・バス</h4>
                             <img src="img/lakesideinn/shower.jpg" alt="シャワー・バス" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>シャワー設備を備えたバススペースです。<br>一日の疲れをゆっくりと癒していただけます。</p>
                             <p>※ 使用後は換気にご協力ください。<br>
                                ※ 冬季は室温が下がる場合があります。</p>`
                    }
                },
                {
                    id: "balcony",
                    icon: "sightseeing",
                    title: { en: "Balcony", jp: "バルコニー" },
                    content: {
                        en: `<img src="img/lakesideinn/balcony.jpg" alt="Balcony" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1rem; border-radius: 6px;">
                             <p>A balcony space where you can enjoy BBQ. Fully equipped with outdoor tables and chairs, you can spend time dining and gathering in an open space.</p>`,
                        jp: `<img src="img/lakesideinn/balcony.jpg" alt="バルコニー" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1rem; border-radius: 6px;">
                             <p>BBQをお楽しみいただけるバルコニースペースです。<br>屋外用テーブルと椅子を完備しており、開放的な空間でお食事や団らんの時間をお過ごしいただけます。</p>`
                    }
                },
                {
                    id: "bbq",
                    icon: "bbq",
                    title: { en: "BBQ", jp: "BBQ" },
                    content: {
                        en: `<h4 class="guide-sub-title">BBQ Information</h4>
                             <img src="img/lakesideinn/bbq.jpg" alt="BBQ Grill" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>The BBQ grill provided is a "Weber" grill.</p>
                             
                             <details class="living-accordion">
                                 <summary>1. Provided Items</summary>
                                 <p>Paper plates, tongs, disposable chopsticks, paper towels, and wet wipes are provided.</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>2. Rainy Weather</summary>
                                 <p>The service may not be available in case of rain. In such cases, a refund will be issued.</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>3. Conditioners & Seasonings</summary>
                                 <p>Seasonings are not provided, so please bring your own.</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>4. Instructions</summary>
                                 <p>Please refer to the links below for how to ignite and shut down the BBQ grill.</p>
                                 <div style="margin-top: 1rem;">
                                     <p style="margin-bottom: 0.5rem;">【Ignition】<br>
                                     <a href="https://drive.google.com/file/d/1O0CbMrKebEDBVjvkamiO2JRYJ6qA1P2t/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">Click here for ignition instructions</a></p>
                                     
                                     <p style="margin-top: 1rem; margin-bottom: 0.5rem;">【Shutdown】<br>
                                     <a href="https://drive.google.com/file/d/1UCZf9_qeLytlMDiObagVpCI4uiUQlE8d/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">Click here for shutdown instructions</a></p>
                                 </div>
                             </details>`,
                        jp: `<h4 class="guide-sub-title">BBQのご案内</h4>
                             <img src="img/lakesideinn/bbq.jpg" alt="BBQコンロ" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 0.5rem auto; border-radius: 6px;">
                             <p>使用するBBQコンロは「Weber（ウェーバー）」製です。</p>
                             
                             <details class="living-accordion">
                                 <summary>1. 用意されているもの</summary>
                                 <p>紙皿・トング・割り箸・ペーパータオル・おしぼりをご用意しております。</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>2. 雨天時の対応</summary>
                                 <p>雨天時はご利用いただけない場合がございます。その際はご返金にて対応いたします。</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>3. 調味料について</summary>
                                 <p>調味料類はご用意しておりませんので、お客様ご自身でご持参ください。</p>
                             </details>
                             <details class="living-accordion">
                                 <summary>4. 着火・消火方法</summary>
                                 <p>以下のリンクより、BBQコンロの着火方法および使用後の締め方をご確認ください。</p>
                                 <div style="margin-top: 1rem;">
                                     <p style="margin-bottom: 0.5rem;">【着火方法】<br>
                                     <a href="https://drive.google.com/file/d/1O0CbMrKebEDBVjvkamiO2JRYJ6qA1P2t/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">着火方法はこちら</a></p>
                                     
                                     <p style="margin-top: 1rem; margin-bottom: 0.5rem;">【締め方】<br>
                                     <a href="https://drive.google.com/file/d/1UCZf9_qeLytlMDiObagVpCI4uiUQlE8d/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">締め方はこちら</a></p>
                                 </div>
                             </details>`
                    }
                },
                {
                    id: "pet-bowls",
                    icon: "dishes",
                    title: { en: "Pet Bowls", jp: "ペット用のお皿" },
                    content: {
                        en: `<p>Two bowls are provided so that they can be used separately for water and food.</p>`,
                        jp: `<p>お水用・フード用として分けてお使いいただけるよう、2枚ご用意しています。</p>
                             <img src="img/lakesideinn/pet_bowls.jpg" alt="ペット用のお皿" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-top: 1rem; border-radius: 6px;">`
                    }
                },
                {
                    id: "speaker",
                    icon: "mic",
                    title: { en: "Speaker", jp: "スピーカー" },
                    content: {
                        en: `<img src="img/lakesideinn/bluetooth_speaker.jpg" alt="Speaker" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1rem; border-radius: 6px;">
                             <p>You can use the speaker by connecting via Bluetooth.</p>
                             <p>The device name will appear as "M's Explore".</p>`,
                        jp: `<img src="img/lakesideinn/bluetooth_speaker.jpg" alt="スピーカー" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1rem; border-radius: 6px;">
                             <p>Bluetoothに接続することで、スピーカーをご利用いただけます。<br>Bluetoothのデバイス名は「M's Explore」と表示されます。</p>`
                    }
                },
                {
                    id: "humidifier",
                    icon: "ac",
                    title: { en: "Humidifier", jp: "加湿器" },
                    content: {
                        en: `<img src="img/lakesideinn/humidifier_main.jpg" alt="Humidifier" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1.5rem; border-radius: 6px;">
                             <h4 class="guide-sub-title">HOW TO USE HUMIDIFIER</h4>
                             
                             <details class="living-accordion">
                                 <summary>1) Fill the Water Tank</summary>
                                 <ul class="guide-list">
                                     <li>・Unplug the power cord.</li>
                                     <li>・Remove the top lid.</li>
                                     <li>・Fill the tank with clean water. Maximum 4.5L.</li>
                                     <li>・Close the lid securely.</li>
                                 </ul>
                             </details>

                             <details class="living-accordion">
                                 <summary>2) Operation with Remote Control</summary>
                                 <p style="margin-top: 0.8rem;"><strong>Power On</strong></p>
                                 <ul class="guide-list" style="margin-bottom: 1rem;">
                                     <li>・Plug in the power cord.</li>
                                     <li>・The white light will blink. The unit enters standby mode.</li>
                                 </ul>
                                 
                                 <p><strong>Turn On and Off</strong></p>
                                 <ul class="guide-list" style="margin-bottom: 1rem;">
                                     <li>・Press the ON/OFF button on the remote to start or stop operation.</li>
                                 </ul>

                                 <p><strong>Heating Mode</strong></p>
                                 <ul class="guide-list" style="margin-bottom: 1rem;">
                                     <li>・Press the Heating button to change modes.</li>
                                     <li>・Low mode: White light.</li>
                                     <li>・Medium mode: Green light.</li>
                                     <li>・High mode: Orange light.</li>
                                     <li>・Auto mode: Blue and red lights.</li>
                                     <li>・Press and hold the Heating button for 3 seconds to stop heating.</li>
                                 </ul>

                                 <p><strong>Note</strong></p>
                                 <ul class="guide-list" style="margin-bottom: 1rem;">
                                     <li>・If the water tank is empty, the orange light will blink. Heating will stop automatically.</li>
                                 </ul>

                                 <p><strong>Timer</strong></p>
                                 <ul class="guide-list" style="margin-bottom: 1rem;">
                                     <li>・Press the Timer button to set the timer.</li>
                                     <li>・2 hours / 4 hours / 6 hours / Timer off.</li>
                                 </ul>

                                 <p><strong>Light On and Off</strong></p>
                                 <ul class="guide-list">
                                     <li>・Press the Light button once to turn the light on.</li>
                                     <li>・Press again to turn it off.</li>
                                 </ul>
                             </details>

                             <details class="living-accordion">
                                 <summary>3) Operation Using the Main Unit Without Remote</summary>
                                 <ul class="guide-list">
                                     <li>・Only basic power and heating control are available.</li>
                                     <li>・Timer and light settings are not available.</li>
                                     <li>・Press the button to change heating levels.</li>
                                     <li>・Press and hold the button for 3 seconds to stop heating.</li>
                                 </ul>
                             </details>`,
                        jp: `<img src="img/lakesideinn/humidifier_main.jpg" alt="加湿器" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin-bottom: 1.5rem; border-radius: 6px;">
                             <p>冬の乾燥している時期は説明書を読んで、お使いください。<br>
                             <a href="https://aimg.as-1.co.jp/c/67/7420/50/67742050manual.pdf?v=7599703f7bfa5f7bce8846de3bf010bee191590a" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">URLはこちら</a></p>`
                    }
                },
                {
                    id: "shuttle",
                    icon: "car",
                    title: { en: "Shuttle", jp: "送迎" },
                    content: {
                        en: `<p>A shuttle van is available during the winter season.<br>
                             <a href="https://drive.google.com/file/d/1_xblxb24uHsjq6iWTSHjDBNKaQEZscDa/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">Click here for details</a></p>`,
                        jp: `<p>送迎用のバンがございますので、冬季期間は送迎が可能です。<br>
                             <a href="https://drive.google.com/file/d/1_xblxb24uHsjq6iWTSHjDBNKaQEZscDa/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: #ccc; text-decoration: underline;">詳細はこちら</a></p>`
                    }
                },
                {
                    id: "amenities",
                    icon: "amenities",
                    title: { en: "Amenities", jp: "アメニティ" },
                    content: {
                        en: `<style>
                                .amenities-compact-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-top: 0.5rem;
                                }
                                .amenities-compact-list li {
                                    margin-bottom: 2px;
                                    line-height: 1.4;
                                    border-bottom: none !important;
                                    padding: 0 !important;
                                }
                             </style>
                             <p>The following amenities are available during your stay:</p>
                             <ul class="amenities-compact-list">
                                 <li>・Hair Dryer (Salonia)</li>
                                 <li>・Hand Towel</li>
                                 <li>・Towel</li>
                                 <li>・Toothbrush</li>
                                 <li>・Shampoo (ecostore)</li>
                                 <li>・Conditioner (ecostore)</li>
                                 <li>・Body Soap (ecostore)</li>
                             </ul>`,
                        jp: `<style>
                                .amenities-compact-list {
                                    list-style: none;
                                    padding-left: 0.5rem;
                                    margin-top: 0.5rem;
                                }
                                .amenities-compact-list li {
                                    margin-bottom: 2px;
                                    line-height: 1.4;
                                    border-bottom: none !important;
                                    padding: 0 !important;
                                }
                             </style>
                             <p>ご滞在中にご利用いただけるアメニティは以下の通りです。</p>
                             <ul class="amenities-compact-list">
                                 <li>・ドライヤー（Salonia）</li>
                                 <li>・ハンドタオル</li>
                                 <li>・タオル</li>
                                 <li>・歯ブラシ</li>
                                 <li>・シャンプー（ecostore）</li>
                                 <li>・コンディショナー（ecostore）</li>
                                 <li>・ボディーソープ（ecostore）</li>
                             </ul>`
                    }
                }
            ]
        },
        {
            id: "neighborhood",
            title: { en: "Neighborhood", jp: "近隣情報" },
            items: [
                {
                    icon: "goods",
                    title: { en: "Supermarkets & Daily Goods", jp: "生活用品・スーパー" },
                    content: {
                        en: `<ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>7-Eleven Nojiriko</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(2 min drive / 12 min walk)</div>
                                    <a href="https://maps.app.goo.gl/G9RWM8weuvCBwHWE8" target="_blank">View Map</a>
                                </li>
                                <li>
                                    <strong>Gas Station ENEOS Nojiriko SS</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(2 min drive)</div>
                                    <a href="https://maps.app.goo.gl/AwKBxDQRZknxXWaUA" target="_blank">View Map</a>
                                </li>
                                <li>
                                    <strong>Matsumoto Kiyoshi Furuma</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(8 min drive)</div>
                                    <a href="https://maps.app.goo.gl/RsZJ9Vxb7pGENTUQ7" target="_blank">View Map</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>7-Eleven Shinanomachi Furuma</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(8 min drive)</div>
                                    <a href="https://maps.app.goo.gl/MWjSvAo96oqHvm9m7" target="_blank">View Map</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>Komeri Shinanomachi</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(8 min drive)</div>
                                    <a href="https://maps.app.goo.gl/qUL7xc5uUWoJMPw79" target="_blank">View Map</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>Minemura Sake Shop</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(8 min drive)</div>
                                    <a href="https://maps.app.goo.gl/GmhirMwhEaAkA3SRA" target="_blank">View Map</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>Daiichi Supermarket Furuma</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(8 min drive)</div>
                                    <a href="https://maps.app.goo.gl/oroYjsQDXvs9zWwn6" target="_blank">View Map</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>Coin Laundry (Laundryia)</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(10 min drive)</div>
                                    <a href="https://maps.app.goo.gl/2HAPqQzSKDrrxgQc9" target="_blank">View Map</a>
                                </li>
                            </ul>
                            <div class="neighborhood-show-more-container" onclick="window.toggleNeighborhoodExtra(this)">
                                <span class="show-more-text">Show More</span>
                                <span class="show-more-icon">▼</span>
                            </div>`,
                        jp: `<ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>セブンイレブン 野尻湖店</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分 / 徒歩12分)</div>
                                    <a href="https://maps.app.goo.gl/G9RWM8weuvCBwHWE8" target="_blank">地図を見る</a>
                                </li>
                                <li>
                                    <strong>ガソリンスタンド（ENEOS 野尻湖SS）</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分)</div>
                                    <a href="https://maps.app.goo.gl/AwKBxDQRZknxXWaUA" target="_blank">地図を見る</a>
                                </li>
                                <li>
                                    <strong>マツモトキヨシ 古間店</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/RsZJ9Vxb7pGENTUQ7" target="_blank">地図を見る</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>セブンイレブン 信濃町古間店</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/MWjSvAo96oqHvm9m7" target="_blank">地図を見る</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>ホームセンター（コメリ 信濃町店）</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/qUL7xc5uUWoJMPw79" target="_blank">地図を見る</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>みねむら酒店</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/GmhirMwhEaAkA3SRA" target="_blank">地図を見る</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>スーパーマーケット（第一スーパー 古間店）</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/oroYjsQDXvs9zWwn6" target="_blank">地図を見る</a>
                                </li>
                                <li class="mobile-extra-item">
                                    <strong>コインランドリー（Laundryia）</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で10分)</div>
                                    <a href="https://maps.app.goo.gl/2HAPqQzSKDrrxgQc9" target="_blank">地図を見る</a>
                                </li>
                            </ul>
                            <div class="neighborhood-show-more-container" onclick="window.toggleNeighborhoodExtra(this)">
                                <span class="show-more-text">その他を見る</span>
                                <span class="show-more-icon">▼</span>
                            </div>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Dining: Western & Cafe", jp: "食事：洋食・カフェ" },
                    content: {
                        en: `<h4 class="guide-sub-title gold-underline">Italian</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">Funagoya</strong>
                                                                                    <a href="https://maps.app.goo.gl/UTGMEnHbVUd4nEMt9" target="_blank" style="font-weight: normal; font-size: 0.9rem;">View Map</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li><strong>Terra</strong><br><a href="https://maps.app.goo.gl/bvsg8gmxt7ARfFV78" target="_blank">View Map</a></li>
                                                                                <li><strong>Nicoli</strong><br><a href="https://maps.app.goo.gl/3PXMN6TghEhUyzEp7" target="_blank">View Map</a></li>
                                                                                <li><strong>Restaurant Rudolf</strong><br><a href="https://maps.app.goo.gl/C2N41Ku3MATQNBcF8" target="_blank">View Map</a></li>
                                                                            </ul>
                                                                        </details>
                                                                        <h4 class="guide-sub-title gold-underline">Hamburger & Western</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">Lamp Nojiriko</strong>
                                                                                    <a href="https://maps.app.goo.gl/WjK4gYTUV2uPQpms5" target="_blank" style="font-weight: normal; font-size: 0.9rem;">View Map</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li><strong>Arrowhead Tavern</strong><br><a href="https://maps.app.goo.gl/Yi2MTGhadx9iZQaw9" target="_blank">View Map</a></li>
                                                                                <li><strong>Lumber jack</strong><br><a href="https://maps.app.goo.gl/woFffzQ9f1bkPExx8" target="_blank">View Map</a></li>
                                                                            </ul>
                                                                        </details>
                                                                        <h4 class="guide-sub-title gold-underline">Cafe & Bakery</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">MYOKO COFFEE</strong>
                                                                                    <a href="https://maps.app.goo.gl/ZfZi2q3FnZJDHYt19" target="_blank" style="font-weight: normal; font-size: 0.9rem;">View Map</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li><strong>EN Bakery 39</strong><br><a href="https://maps.app.goo.gl/H1krSAdkcu498NXM6" target="_blank">View Map</a></li>
                                                                            </ul>
                                                                        </details>
`,
                        jp: `<h4 class="guide-sub-title gold-underline">イタリアン</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">Funagoya舟小屋</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で1分／徒歩2分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=Funagoya舟小屋" target="_blank" rel="noopener noreferrer" style="font-weight: normal; font-size: 0.9rem;">地図を見る</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li>
                                                                                    <strong>イタリア料理 テルラ</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=イタリア料理テルラ" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                                <li>
                                                                                    <strong>Nicoli</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で15分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=Nicoli" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                                <li>
                                                                                    <strong>レストランルドルフ</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で25分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=レストランルドルフ" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                            </ul>
                                                                        </details>
                                                                        <h4 class="guide-sub-title gold-underline">ハンバーガー・洋食</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">Lamp野尻湖</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分／徒歩10分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=Lamp野尻湖" target="_blank" rel="noopener noreferrer" style="font-weight: normal; font-size: 0.9rem;">地図を見る</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li>
                                                                                    <strong>Arrowhead Tavern</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(徒歩1分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=Arrowhead+Tavern" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                                <li>
                                                                                    <strong>Lumber jack</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分／徒歩15分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=Lumber+jack" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                            </ul>
                                                                        </details>
                                                                        <h4 class="guide-sub-title gold-underline">カフェ・パン屋</h4>
                                                                        <details class="living-accordion">
                                                                            <summary>
                                                                                <div>
                                                                                    <strong style="display: block; margin-bottom: 0.25rem;">MYOKO COFFEE 高原駅前</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で10分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=MYOKO+COFFEE+高原駅前" target="_blank" rel="noopener noreferrer" style="font-weight: normal; font-size: 0.9rem;">地図を見る</a>
                                                                                </div>
                                                                            </summary>
                                                                            <ul class="guide-list neighborhood-list two-col" style="margin-top: 1rem;">
                                                                                <li>
                                                                                    <strong>EN　ベーカリー39</strong>
                                                                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(徒歩1分)</div>
                                                                                    <a href="https://www.google.com/maps/search/?api=1&query=EN+ベーカリー39" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                                </li>
                                                                            </ul>
                                                                        </details>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Dining: Japanese & Asian", jp: "食事：和食・中華・その他" },
                    content: {
                        en: `<div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    Japanese(Soba, etc.) <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>Issa Shokudo</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 1 min / On foot: 4 min)</div>
                        <a href="https://maps.app.goo.gl/XLfyapZ5Q18Sbtfx6" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Shinanoya (Soba)</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 6 min)</div>
                        <a href="https://maps.app.goo.gl/ygT2EQkCH6XDHxE68" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Restaurant Kiju</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 2 min / On foot: 18 min)</div>
                        <a href="https://maps.app.goo.gl/uDQRMJ9VLrtyq6Pt5" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Sobadokoro Takasawa</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 10 min)</div>
                        <a href="https://maps.app.goo.gl/VDjwwczuSCyfd3bj7" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Jurin (Tonkatsu)</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 12 min)</div>
                        <a href="https://maps.app.goo.gl/5VVSB9mKbypkdTtt8" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Kirakuen</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 17 min)</div>
                        <a href="https://maps.app.goo.gl/v2sRJLwR4KmqceD27" target="_blank">View Map</a>
                    </li>
                </ul>
            </div>
            
            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    Sushi & Yakiniku <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>Kitokito Sushi</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 25 min)</div>
                        <a href="https://maps.app.goo.gl/YQjLdV7eNGG9yF6E9" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Yakiniku Toyooka</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 22 min)</div>
                        <a href="https://maps.app.goo.gl/LxeKEXAFVqEAAJ4f9" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Echigoya</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 20 min)</div>
                        <a href="https://maps.app.goo.gl/3gspUgVzZQreVQ8Z7" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Yakiniku Otagiri</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 32 min)</div>
                        <a href="https://maps.app.goo.gl/u5Lh6yn9c2V2ErtZ8" target="_blank">View Map</a>
                    </li>
                </ul>
            </div>

            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    Chinese & Ramen <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>Eika (Machichuka)</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 11 min)</div>
                        <a href="https://maps.app.goo.gl/GKcWKjfZFrXxD9xP9" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Arakin Ramen</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 10 min)</div>
                        <a href="https://maps.app.goo.gl/royTk9WKLCv81MS49" target="_blank">View Map</a>
                    </li>
                </ul>
            </div>

            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    Izakaya <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>Tamaki</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 9 min)</div>
                        <a href="https://maps.app.goo.gl/QCEC39Y7BKbni2u9A" target="_blank">View Map</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>Nihontei</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 5 min)</div>
                        <a href="https://maps.app.goo.gl/AevwtYUQZE3ZgBXq6" target="_blank">View Map</a>
                    </li>
                </ul>
            </div>`,
                        jp: `<div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    和食 <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>一茶食堂</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で1分 / 徒歩4分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=一茶食堂" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>信濃屋 そば</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で6分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=信濃屋そば" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>レストラン樹香</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分 / 徒歩18分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=レストラン樹香" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>そば処 たかさわ</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で10分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=そば処たかさわ" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>樹林とんかつ</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で12分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=樹林とんかつ" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>きらく園</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で17分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=きらく園" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                </ul>
            </div>

            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    寿司・焼肉 <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>きときと寿司</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で25分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=きときと寿司" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>精肉焼肉とよおか</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で22分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=精肉焼肉とよおか" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>越後屋</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で20分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=越後屋" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>焼肉おたぎり</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で32分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=焼肉おたぎり" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                </ul>
            </div>

            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    中華・ラーメン <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>栄華 町中華</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で11分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=栄華+町中華" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>あらきんラーメン</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で10分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=あらきんラーメン" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                </ul>
            </div>

            <div class="dining-accordion-group">
                <h4 class="guide-sub-title dining-accordion-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;" onclick="window.toggleDiningAccordion(this)">
                    居酒屋 <span class="accordion-icon">▶</span>
                </h4>
                <ul class="guide-list neighborhood-list two-col">
                    <li>
                        <strong>町酒場 たまき</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で9分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=町酒場+たまき" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                    <li style="display:none" class="hidden-item">
                        <strong>日本亭</strong>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で5分)</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=日本亭" target="_blank" rel="noopener noreferrer">地図を見る</a>
                    </li>
                </ul>
            </div>`,
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Onsen & Sauna", jp: "温泉・サウナ" },
                    content: {
                        en: `<ul class="guide-list neighborhood-list two-col">
                                                                            <li><strong>Madarao no Yu</strong> (Tattoo friendly)<br><a href="https://maps.app.goo.gl/YmcpSpDAjNMbH1ND9" target="_blank">View Map</a></li>
                                                                            <li><strong>THE SAUNA</strong><br><a href="https://maps.app.goo.gl/f2GPWJpnjmtHuHWQ8" target="_blank">View Map</a></li>
                                                                        </ul>`,
                        jp: `<ul class="guide-list neighborhood-list two-col">
                                                                            <li>
                                                                                <strong>まだらおの湯</strong> (タトゥーOK)
                                                                                <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で25分)</div>
                                                                                <a href="https://www.google.com/maps/search/?api=1&query=まだらおの湯" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                            </li>
                                                                            <li>
                                                                                <strong>THE SAUNA</strong>
                                                                                <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分／徒歩10分)</div>
                                                                                <a href="https://www.google.com/maps/search/?api=1&query=THE+SAUNA" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                                                            </li>
                                                                        </ul>`
                    }
                },
                {
                    icon: "sightseeing",

                    title: { en: "Ski Resorts", jp: "スキー場" },
                    content: {
                        en: `<div class="resort-list">
                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Seki Onsen Ski Resort</strong> (20 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Famous for heavy snow and powder. Advanced/Expert friendly with many non-groomed areas. Quiet and uncrowded.</p>
                                        <a href="https://maps.app.goo.gl/UvR1L72DBz7xh8ei9" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Myoko Kogen / Akakura Onsen</strong> (15 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Wide variety of courses from beginner to advanced. Connected to Akakura Onsen town with great après-ski. Popular international resort.</p>
                                        <a href="https://maps.app.goo.gl/e4FE18NLo76F4yde6" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Kurohime Kogen Snow Park</strong> (10 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Gentle slopes ideal for families and beginners. Excellent kids park and ski school. Uncrowded and relaxed.</p>
                                        <a href="https://maps.app.goo.gl/6Sjiz78maGxLj2aD6" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Tangram Ski Circus</strong> (14 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">All-in-one resort with hotel. Perfect for beginners and families. Offers activities beyond skiing.</p>
                                        <a href="https://maps.app.goo.gl/1oPx6GfS8E4DnXXZA" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Madarao Kogen Ski Resort</strong> (22 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Known for the highest number of tree run courses in Japan. Popular for powder and backcountry lovers. Intermediate to Advanced.</p>
                                        <a href="https://maps.app.goo.gl/Bp4w27e8xNyrm1RV6" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Nozawa Onsen Ski Resort</strong> (45 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Large scale resort with long runs. Historic onsen town atmosphere with free public baths. Great for sightseeing and skiing.</p>
                                        <a href="https://maps.app.goo.gl/zxcZVxCCdwNSAaXx6" target="_blank">View Map</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>Shiga Kogen Ski Resort</strong> (55 min drive)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">Japan's largest ski area (18 resorts). High altitude and stable snow quality. For advanced skiers and long stays.</p>
                                        <a href="https://maps.app.goo.gl/bDKF6hhpRqY1RVoJA" target="_blank">View Map</a>
                                    </div>
                                </details>
                            </div>`,
                        jp: `<div class="resort-list">
                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>関温泉スキー場</strong> (車で20分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">豪雪と上級者向けゲレンデで知られるローカルスキー場。非圧雪エリアが多く、パウダースノーを求める玄人スキーヤーに最適です。観光客が少なく、静かな環境で滑りたい方におすすめ。</p>
                                        <a href="https://maps.app.goo.gl/UvR1L72DBz7xh8ei9" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>妙高高原・赤倉温泉スキー場</strong> (車で15分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">初級から上級まで対応する豊富なコースバリエーションが魅力。ゲレンデ直結の赤倉温泉街があり、アフタースキーも充実しています。外国人観光客にも人気の国際的リゾートです。</p>
                                        <a href="https://maps.app.goo.gl/e4FE18NLo76F4yde6" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>黒姫高原スノーパーク</strong> (車で10分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">緩やかな斜面が多く、ファミリーや初心者に最適なスキー場。日本最大級のキッズパークやスキー教室が充実。混雑が少なく、のんびりと楽しめます。</p>
                                        <a href="https://maps.app.goo.gl/6Sjiz78maGxLj2aD6" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>タングラムスキーサーカス</strong> (車で14分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">ホテル併設のオールインワンリゾート。初心者コースやキッズエリアが充実しており、ファミリー層に人気。スノーアクティビティも豊富。</p>
                                        <a href="https://maps.app.goo.gl/1oPx6GfS8E4DnXXZA" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>斑尾高原スキー場</strong> (車で22分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">日本一のツリーランコース数を誇る、パウダー＆バックカントリー好きの聖地。地形を生かしたコースが多く、中級〜上級者も満足できます。</p>
                                        <a href="https://maps.app.goo.gl/Bp4w27e8xNyrm1RV6" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>野沢温泉スキー場</strong> (車で45分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">広大な敷地と長い滑走距離が魅力のビッグゲレンデ。歴史ある温泉街と一体化しており、スキー後の外湯巡りや観光も含めて楽しめます。</p>
                                        <a href="https://maps.app.goo.gl/zxcZVxCCdwNSAaXx6" target="_blank">地図を見る</a>
                                    </div>
                                </details>

                                <details class="living-accordion" name="ski-resort-group">
                                    <summary>
                                        <div><strong>志賀高原スキー場</strong> (車で55分)</div>
                                    </summary>
                                    <div class="accordion-body">
                                        <p class="resort-desc">日本最大級のスキーエリア（18のスキー場が集結）。標高が高く、雪質の良さと規模の大きさは圧倒的。長期滞在して全山制覇を目指す上級者にも。</p>
                                        <a href="https://maps.app.goo.gl/bDKF6hhpRqY1RVoJA" target="_blank">地図を見る</a>
                                    </div>
                                </details>
                            </div>`,
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
                    title: { en: "Cancellation Policy", jp: "キャンセルポリシー" },
                    content: {
                        en: `<h4 class="guide-sub-title">Full Refund</h4>
                                                                        <p>Canceled 30+ days before check-in, OR canceled within 24 hours of booking (if booking made at least 7 days before check-in).</p>
                                                                        <h4 class="guide-sub-title">50% Refund</h4>
                                                                        <p>Canceled 30+ days before check-in but after the 24-hour grace period.</p>
                                                                        <h4 class="guide-sub-title">Full Refund</h4>
                                                                        <p>Canceled less than 30 days before check-in, IF booking was made at least 7 days before check-in and canceled within 24 hours.</p>
                                                                        <h4 class="guide-sub-title">No Refund (Tax Only)</h4>
                                                                        <p>Canceled less than 30 days before check-in and after the 24-hour grace period.</p>`,
                        jp: `<h4 class="guide-sub-title">全額返金</h4>
                                                                        <p>チェックイン30日前までのキャンセル、またはチェックイン7日前までの予約で予約確定後24時間以内のキャンセル。</p>
                                                                        <h4 class="guide-sub-title">50%返金</h4>
                                                                        <p>チェックイン30日前までのキャンセルで、予約確定後24時間を過ぎた場合。</p>
                                                                        <h4 class="guide-sub-title">全額返金</h4>
                                                                        <p>チェックイン30日を切ってからのキャンセルだが、チェックイン7日前までの予約で予約確定後24時間以内のキャンセル。</p>
                                                                        <h4 class="guide-sub-title">返金なし（税金のみ）</h4>
                                                                        <p>チェックイン30日を切ってからのキャンセルで、予約確定後24時間を過ぎている場合。</p>`
                    }
                },
                {
                    icon: "rules",
                    title: { en: "General Rules", jp: "ルール" },
                    content: {
                        en: `<h4 class="guide-sub-title">Noise</h4>
                                                                        <p>Please refrain from loud noise, music, or partying that bothers neighbors. Loitering around the entrance is prohibited. Use may be terminated if complaints adhere.</p>
                                                                        <h4 class="guide-sub-title">Smoking</h4>
                                                                        <p><strong>Strictly No Smoking Indoors.</strong> Smoking is allowed on the terrace only. No ashtrays provided. A fine will be charged if indoor smoking is discovered.</p>
                                                                        <h4 class="guide-sub-title">Damages</h4>
                                                                        <p>Please report any damage or stains immediately, whether intentional or accidental. Charges may apply based on terms.</p>
                                                                        <h4 class="guide-sub-title">Other</h4>
                                                                        <p>Violations of terms may result in termination of stay. Package delivery/receipt before or after reservation hours is not allowed (unless approved).</p>`,
                        jp: `<h4 class="guide-sub-title">騒音について</h4>
                                                                        <p>大声で騒ぐ・音楽を大音量で流すなど近隣のご迷惑になる行為はご遠慮ください。入口周辺でのたむろ行為は周辺住民のご迷惑となります。近隣から指摘があった場合、利用を中止いただくことがあります。</p>
                                                                        <h4 class="guide-sub-title">喫煙</h4>
                                                                        <p>建物内は禁煙となります。喫煙をされる場合は、テラスでお願いします。灰皿の用意はありません。喫煙が発覚した場合、罰金を課させていただきます。</p>
                                                                        <h4 class="guide-sub-title">破損・汚損があった際の対応</h4>
                                                                        <p>備品や設備を破損汚損された場合、故意または過失を問わず必ずご連絡をお願いします。利用規約に基づきご請求をさせていただく場合があります。</p>
                                                                        <h4 class="guide-sub-title">その他</h4>
                                                                        <p>利用規約に反したご利用が確認された場合は、利用中止をさせていただくことがあります。予約時間前後に荷物を受取、配達をすることはできません。</p>`
                    }
                },
                {
                    icon: "trash",
                    title: { en: "Trash", jp: "ゴミ" },
                    content: {
                        en: `<p style="margin-bottom: 0;">The trash bins are located under the kitchen sink.<br>Please sort your trash into the following categories:</p>
                                                                        <ul class="guide-list" style="margin-top: 1rem; margin-bottom: 1rem; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">1) Burnable Trash</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">2) Cans & Bottles</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">3) PET Bottles</li>
                                                                        </ul>
                                                                        <img src="img/lakesideinn/garbage.jpg" alt="Trash Bins" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`,
                        jp: `<p style="margin-bottom: 0;">ゴミ箱はキッチンの下にあります。<br>分別にご協力をお願いいたします。</p>
                                                                        <ul class="guide-list" style="margin-top: 1rem; margin-bottom: 1rem; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・可燃ゴミ</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・缶・びん</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・ペットボトル</li>
                                                                        </ul>
                                                                        <img src="img/lakesideinn/garbage.jpg" alt="ゴミ箱" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto; border-radius: 6px;">`
                    }
                },
                {
                    icon: "info",
                    title: { en: "Important Notes", jp: "注意事項" },
                    content: {
                        en: `<ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem;">① Do not take amenities home. You may be charged for unauthorized removal.</li>
                                                                            <li style="margin-bottom: 0.2rem;">② Do not enter with shoes on.</li>
                                                                            <li style="margin-bottom: 0.2rem;">③ Be mindful of noise when windows or the entrance are open.</li>
                                                                            <li style="margin-bottom: 0;">④ There are no security cameras. Please manage your own valuables.</li>
                                                                        </ul>`,
                        jp: `<ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem;">① 備品は持ち帰らないでください。無断持ち出しは請求対象となる場合があります。</li>
                                                                            <li style="margin-bottom: 0.2rem;">② 靴で室内には入らないでください。</li>
                                                                            <li style="margin-bottom: 0.2rem;">③ 窓、玄関を開放しての騒音はご注意ください。</li>
                                                                            <li style="margin-bottom: 0;">④ 防犯カメラは設置しておりません。貴重品の管理はご利用者様で行ってください。</li>
                                                                        </ul>`,
                    }
                },
                {
                    icon: "info",
                    title: { en: "Outdoor Usage Rules", jp: "屋外利用ルール" },
                    content: {
                        en: `<h4 class="guide-sub-title">1. Summer Lake Safety</h4>
                                                                        <p>Please observe the following safety rules when swimming or playing in Lake Nojiri:</p>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Please do not go beyond the pier.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Do not dive in shallow areas.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Always have at least one person watching from the shore.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Please refrain from swimming if you are not confident.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Never leave children unattended.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Wearing a life jacket is strongly recommended.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・Entering the water after sunset is strictly prohibited.</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・Thank you for your cooperation in ensuring everyone's safety.</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">2. Fire Ban in National Park</h4>
                                                                        <p>As this area is a designated National Park, the use of open fire such as bonfires or campfires outdoors is prohibited by law.<br>
                                                                        We appreciate your understanding and cooperation.</p>`,
                        jp: `<h4 class="guide-sub-title">1. 夏に湖へ入る際の注意事項</h4>
                                                                        <p>野尻湖での水遊び・遊泳時の注意点が下記にございますので、ご確認をお願いいたします。</p>
                                                                        <br>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・桟橋より沖へは出ないようお願いいたします。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・水深の浅い場所では飛び込まないでください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・グループ全員で入水せず、1名は必ず陸で待機してください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・泳ぎに自信のない方は遊泳をお控えください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・お子様から目を離さないよう、十分にご注意ください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・ライフジャケットの着用を強く推奨いたします。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・日没後の入水は大変危険なため、禁止いたします。</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・皆様の安全確保のため、ご理解とご協力をお願い申し上げます。</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">2. 国立公園における火気使用禁止について</h4>
                                                                        <p>当エリアは国立公園に指定されているため、屋外での焚き火・キャンプファイヤー等の火気使用は、法律により禁止されています。<br>
                                                                        皆さまのご理解とご協力をお願いいたします。</p>`
                    }
                },
                {
                    icon: "rules",
                    title: { en: "Pet Guidelines", jp: "ペットの注意事項" },
                    content: {
                        en: `<h4 class="guide-sub-title">1. Pet Rules</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Up to 2 small dogs (under 10kg) are allowed.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Some cabins do not allow pets. We may refuse entry if booked in a non-pet cabin.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">You must declare pets at the time of booking (Undeclared pets will incur additional fees).</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Toilet-trained dogs only.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Please ensure flea/tick prevention is done.</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">For other pets, please consult us in advance.</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">2. Walking & Outing</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Please keep dogs on a leash when walking on the premises or nearby.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">You must clean up after your dog and bring waste bags.</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Waste can be disposed of as burnable trash, but there is no specific disposal facility on-site.<br>　Please dispose of it at nearby trash bins (convenience stores, etc.).</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">3. Trouble Prevention</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">We are not responsible for any trouble with other animals or guests (barking, biting, etc.).</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">Please avoid leaving dogs alone in the room for long periods.</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">4. Indoor Manners</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Pets are not allowed on beds or loft futons. They are free to roam in other spaces (living/dining).</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">Floors are wooden, so accidents are less likely to soak in, but please wipe up immediately for hygiene/odor control.</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">If shedding is a concern, please use your own lint rollers.</li>
                                                                        </ul>`,
                        jp: `<h4 class="guide-sub-title">1. ペット同伴に関するルール</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・小型犬2匹まで（体重10kg以下）のご同伴が可能です。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・ペットがご利用いただけない棟もございます。その場合は事前にお断りさせていただく可能性がありますので、ご了承ください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・ご予約時に、必ずペット同伴の旨をご申告ください（※無断同伴は追加料金の対象となります）。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・トイレトレーニング済みのわんちゃんに限ります。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・ノミ・ダニ対策を済ませた上でご宿泊ください。</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・その他のペットにつきましては、事前にご相談ください。</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">2. 散歩・外出時の注意</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・敷地内および周辺を散歩される際は、必ずリードを着用してください。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・フンの処理およびマナー袋の持参は必須です。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・排泄物（トイレシート等を含む）は可燃ゴミとして処分可能ですが、施設内にゴミ処理設備はありません。</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・お手数ですが、近隣のゴミ箱（コンビニ等）にて各自ご処分をお願いいたします。</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">3. トラブル防止についてのお願い</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・他の動物や宿泊者とのトラブル（吠え、噛みつき等）につきまして、当施設では責任を負いかねます。</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・わんちゃんをお部屋に残したままでの長時間の外出はお控えください（不安による吠えや粗相の原因となる場合があります）。</li>
                                                                        </ul>
                                                                        <h4 class="guide-sub-title" style="margin-top: 2rem;">4. 室内でのマナー</h4>
                                                                        <ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・ベッドルーム内およびロフトの布団へのペットの立ち入りはご遠慮ください。それ以外のスペース（リビング・ダイニング等）では放し飼い可能です。</li>
                                                                            <li style="margin-bottom: 0.2rem; border-bottom: none; padding: 0;">・床は木製素材のため、万が一の粗相があった場合でも染み込みにくくなっていますが、気付いた際は、衛生・消臭のため、なるべく早めに拭き取りをお願いいたします。</li>
                                                                            <li style="margin-bottom: 0; border-bottom: none; padding: 0;">・抜け毛が気になる場合は、お持ちのコロコロ等をご利用ください。</li>
                                                                        </ul>`
                    }
                },
                {
                    icon: "money",
                    title: { en: "Pricing", jp: "料金体系" },
                    content: {
                        en: `<p><strong>Capacity:</strong> Up to 8 guests(Adults + Children).</p>
                                                                        <p><strong>Extra Guest Fee:</strong> ¥5,000 per person for 4+ guests.</p>
                                                                        <p><strong>Infants:</strong> Counted as 1 guest from age 0.</p>`,
                        jp: `<p><strong>定員:</strong> 大人・子供合わせて8名まで。</p>
                                                                        <p><strong>追加料金:</strong> 4名以上は一人当たり5,000円がかかります。</p>
                                                                        <p><strong>乳幼児:</strong> 0歳児から1名とカウントさせていただきます。</p>`
                    }
                },
                {
                    icon: "check",
                    title: { en: "Checkout Checklist", jp: "退出時チェックリスト" },
                    content: {
                        en: `<ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem;">① Return furniture/items to original layout.</li>
                                                                            <li style="margin-bottom: 0.2rem;">② Separate trash (see guidelines).</li>
                                                                            <li style="margin-bottom: 0.2rem;">③ Empty fridge (take all food home).</li>
                                                                            <li style="margin-bottom: 0.2rem;">④ Turn off AC and lights.</li>
                                                                            <li style="margin-bottom: 0.2rem;">⑤ Check for personal belongings (cables, fridge, clothes).</li>
                                                                            <li style="margin-bottom: 0;">⑥ Report any lost or broken items.</li>
                                                                        </ul>`,
                        jp: `<ul class="guide-list" style="margin-bottom: 0; padding-left: 0; list-style: none;">
                                                                            <li style="margin-bottom: 0.2rem;">① 机や椅子、小物を動かされた場合は、元のレイアウトに戻してください</li>
                                                                            <li style="margin-bottom: 0.2rem;">② ゴミ類は分別して置いてください</li>
                                                                            <li style="margin-bottom: 0.2rem;">③ 残った食材は冷蔵庫に残さず、全てお持ち帰りください</li>
                                                                            <li style="margin-bottom: 0.2rem;">④ エアコン、電気等の電源をオフにしてください</li>
                                                                            <li style="margin-bottom: 0.2rem;">⑤ 忘れ物はありませんか?(充電ケーブル/冷蔵庫内/傘/洋服 等)</li>
                                                                            <li style="margin-bottom: 0;">⑥ 備品の紛失、破損等があった場合はご連絡をお願い致します</li>
                                                                        </ul>`,
                    }
                },
                {
                    icon: "phone",
                    title: { en: "Emergency Contact", jp: "緊急連絡先" },
                    content: {
                        en: `<p><strong>Manager (Kobayashi):</strong> 090 - 9357 - 5586</p>`,
                        jp: `<p><strong>管理者 (小林):</strong> 090 - 9357 - 5586</p>`,
                    }
                }
            ]
        },
        {
            id: "faq",
            title: { en: "FAQ", jp: "よくある質問" },
            items: [
                {
                    icon: "rooms",
                    title: { en: "Change Guest Count", jp: "宿泊人数変更したいです" },
                    content: {
                        en: `<p><strong>OTA Bookings:</strong> Please contact the OTA(Booking.com, Airbnb, etc.) directly.</p>
    <p><strong>Official Site Bookings:</strong> Please contact us via chat or the email you used for booking.</p>`,
                        jp: `<p><strong>OTAからご予約の場合:</strong> 各OTAにお問い合わせください。</p>
    <p><strong>公式サイトからのご予約の場合:</strong> チャットまたはご予約いただいたメールアドレスからお問い合わせください。</p>`
                    }
                },

                {
                    icon: "power",
                    title: { en: "Breaker Tripped", jp: "ブレーカー落ちた時どうすればいいでしょうか" },
                    content: {
                        en: `<p>If the power goes out, a breaker may have tripped.Please follow these steps to restore power:</p>
                                                                        <p>1. Find the tripped breaker (near the entrance) and push it all the way DOWN.</p>
                                                                        <details class="living-accordion" style="margin-bottom: 1rem;">
                                                                            <summary>View Image</summary>
                                                                            <img src="img/lakesideinn/breaker_step_2.png" alt="Step 1: Push Down" class="living-image" loading="lazy" style="width: 60%; display: block; margin: 1rem auto 0;">
                                                                        </details>
                                                                            <p>2. Then push it all the way UP to "ON".<br>👉 It should click into place.</p>
                                                                            <details class="living-accordion">
                                                                                <summary>View Image</summary>
                                                                                <img src="img/lakesideinn/breaker_step_1.png" alt="Step 2: Push Up" class="living-image" loading="lazy" style="width: 60%; display: block; margin: 1rem auto 0;">
                                                                            </details>`,
                        jp: `<p>電気が突然使えなくなった場合、ブレーカーが落ちている可能性があります。<br>以下の手順で復旧してください。</p>
                                                                                <p>① 玄関付近にあるブレーカーのうち、落ちているものを一度いちばん下まで下げてください。<br>※ 下の画像①をご参照ください。</p>
                                                                                <details class="living-accordion" style="margin-bottom: 1rem;">
                                                                                    <summary>画像を表示</summary>
                                                                                    <img src="img/lakesideinn/breaker_step_1.jpg" alt="手順1: ブレーカーを下げる" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto 0; border-radius: 6px;">
                                                                                </details>
                                                                                <p>② その後、しっかり上まで上げて「ON」にしてください。<br>👉 カチッと音がすればOKです。<br>※ 下の画像②をご参照ください。</p>
                                                                                <details class="living-accordion">
                                                                                    <summary>画像を表示</summary>
                                                                                    <img src="img/lakesideinn/breaker_step_2.jpg" alt="手順2: ブレーカーを上げる" class="living-image" loading="lazy" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto 0; border-radius: 6px;">
                                                                                </details>`
                    }
                },
                {
                    icon: "receipt",
                    title: { en: "Issue Receipt", jp: "領収書発行したい場合どうすればいいでしょうか" },
                    content: {
                        en: `<p><strong>OTA Bookings:</strong> Please issue the receipt through the OTA platform.</p>
                                                                                        <p><strong>Official Site Bookings:</strong> Please contact us via chat or email.</p>`,
                        jp: `<p><strong>OTAからご予約の場合:</strong> 各OTAにお問い合わせください。</p>
                                                                                        <p><strong>公式サイトからのご予約の場合:</strong> チャットまたはご予約いただいたメールアドレスからお問い合わせください。</p>`
                    }
                },
                {
                    icon: "luggage",
                    title: { en: "Luggage Delivery", jp: "事前・事後に荷物を配送したい場合" },
                    content: {
                        en: `<p><strong>Pre-delivery:</strong> Accepted if arriving <strong>after 12:00 PM</strong> on check-in day.</p>
                                                                                        <p><strong>Delivery Method:</strong> Packages will be left at the entrance (unlocked area) as this is a self-check-in facility.</p>
                                                                                        <div class="warning-box">
                                                                                            <strong>Warning:</strong> We are not responsible for any loss of items. Please do NOT ship valuables.
                                                                                        </div>
                                                                                        <p><strong>Address:</strong> 54-3 Nojiri, Shinano-machi, Kamiminochi-gun, Nagano-ken</p>
                                                                                        <p><strong>Recipient:</strong> Please write your Check-in Date and Reservation Name.</p>`,
                        jp: `<p><strong>事前配送:</strong> ご宿泊日の<strong>当日12時以降</strong>の到着指定であれば可能です。</p>
                                                                                        <p><strong>受取方法:</strong> 無人営業のため、お受け取りはできません。置き配（玄関・施錠なし）となります。</p>
                                                                                        <div class="warning-box">
                                                                                            <strong>注意:</strong> 紛失の責任は負いかねます。貴重品類の配送はお控えくださいませ。
                                                                                        </div>
                                                                                        <p><strong>送付先:</strong> 長野県上水内郡信濃町野尻54-3</p>
                                                                                        <p><strong>宛名:</strong> 宿泊日/ご予約名の記載をお願いいたします。</p>`
                    }
                },
                {
                    icon: "help",
                    title: { en: "Lost Items", jp: "忘れ物をした場合" },
                    content: {
                        en: `<p style="margin-bottom: 0;">For privacy reasons, we do not contact guests regarding lost items.</p>
                                                                                        <p style="margin-bottom: 0;">If you realize you left something behind, please contact us via your booking platform message or phone.</p>`,
                        jp: `<p style="margin-bottom: 0;">プライバシーの観点から、施設側から忘れ物のご連絡はいたしません。</p>
                                                                                        <p style="margin-bottom: 0;">お気づきの際は、ご予約いただいたOTAのメッセージまたは電話等でご連絡ください。</p>`
                    }
                },
                {
                    icon: "clock",
                    title: { en: "Early Check-in / Late Check-out", jp: "アーリーチェックインとレートチェックアウト" },
                    content: {
                        en: `<p>Available depending on reservation schedules.</p>
                                                                                        <p><strong>Fee:</strong> ¥4,000 per hour (includes cleaning fee adjustment).</p>
                                                                                        <p>Please contact us in advance to check availability.</p>`,
                        jp: `<p>前後の予約状況によりますが、早くチェックインまたは遅くチェックアウトしたい場合は、清掃費を含めて、1時間ごとに追加で4,000円をいただいております。</p>`
                    }
                },
                {
                    icon: "car",
                    title: { en: "Access", jp: "アクセス" },
                    content: {
                        en: `<div style="margin-bottom: 2rem;">
                                                                            <p style="margin-bottom: 0.5rem;"><strong>Q. Do I need a 4WD vehicle during heavy snow?</strong></p>
                                                                            <p style="margin-bottom: 0;">A. During winter when there is snow, driving without a 4WD vehicle equipped with studless tires is extremely difficult. For your safety, please ensure you come with a 4WD vehicle and studless tires.</p>
                                                                        </div>
                                                                        <div style="margin-bottom: 0;">
                                                                            <p style="margin-bottom: 0.5rem;"><strong>Q. Is there public transportation?</strong></p>
                                                                            <p style="margin-bottom: 0;">A. During the winter season, public transportation is limited, and taxi services may not be available.<br>
                                                                            Therefore, we offer a private shuttle service limited to the winter season. Please consult us in advance if you wish to use it.</p>
                                                                        </div>`,
                        jp: `<div style="margin-bottom: 2rem;">
                                                                            <p style="margin-bottom: 0.5rem;"><strong>Q. 大雪の時期は四駆でないといけませんか？</strong></p>
                                                                            <p style="margin-bottom: 0;">A. 冬季の積雪時は、四駆かつスタッドレスタイヤ装着車でないと走行が非常に困難です。安全のため、必ず四駆＋スタッドレスタイヤでお越しください。</p>
                                                                        </div>
                                                                        <div style="margin-bottom: 0;">
                                                                            <p style="margin-bottom: 0.5rem;"><strong>Q. 公共交通機関はありますか？</strong></p>
                                                                            <p style="margin-bottom: 0;">A. 冬季期間は公共交通機関が限られており、タクシー会社も利用できない場合があります。<br>
                                                                            そのため、当施設では冬季限定の自社送迎サービスをご用意しております。ご希望の場合は、事前にご相談ください。</p>
                                                                        </div>`
                    }
                }
            ]
        }
    ],
    services: [
        {
            id: 1,
            name: { en: "BBQ", jp: "BBQ" },
            price: 4000,
            description: {
                en: "Enjoy BBQ on the deck.\n*Please note that only 2 grills are available in total.",
                jp: "デッキでのBBQをお楽しみいただけます。\n※BBQグリルは全体で2台のみのご用意となりますので、あらかじめご了承ください。"
            },
            image: "img/lakesideinn/bbq.jpg",
            icon: "bbq"
        }
    ]
};

// ============================================
// LANGUAGE HELPERS
// ============================================
function getLang() {
    return window.currentLang || 'en';
}

function getLocalizedText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = getLang();
    return obj[lang] || obj.en || obj.jp || '';
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGuidebook();
    initNavigation();

    // Implement toggleLanguage and updateContent since app.js is not loaded
    window.updateContent = () => {
        const lang = getLang();
        const t = window.translations && window.translations[lang] ? window.translations[lang] : {};

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = t[key];

            if (translation !== undefined) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.getAttribute('placeholder')) {
                        element.placeholder = translation;
                    } else {
                        element.value = translation;
                    }
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } else {
                    // Check for HTML content in specific keys if needed, otherwise textContent
                    if (key.includes('headline') || key.includes('desc')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            }
        });
    };

    window.toggleLanguage = (targetLang) => {
        if (targetLang) {
            window.currentLang = targetLang;
        } else {
            window.currentLang = window.currentLang === 'en' ? 'jp' : 'en';
        }
        localStorage.setItem('siteLang', window.currentLang);

        // Toggle body class
        if (document.body) {
            document.body.classList.remove('lang-en', 'lang-jp');
            document.body.classList.add(`lang-${window.currentLang}`);
        }

        // Update all content
        window.updateContent();

        // Re-render guidebook content
        renderGuidebook();
        updateLanguageLabel();
    };

    // Initial label update and content translation
    window.updateContent();
    updateLanguageLabel();

    // Initialize New Navigation
    renderTopNav();
    // Initialize New Navigation
    renderTopNav();
    switchCategory('access'); // Default to access
});

const categories = [
    { id: 'access', title: { en: 'Access & WiFi', jp: 'アクセス ＆ WiFi' }, icon: 'address' },
    { id: 'services', title: { en: 'Optional Services', jp: '有料サービス' }, icon: 'amenities' },
    { id: 'facility', title: { en: 'Room & Equipment Guide', jp: '各部屋と備品のご案内' }, icon: 'rooms' },
    { id: 'neighborhood', title: { en: 'Neighborhood', jp: '周辺情報' }, icon: 'sightseeing' },
    { id: 'rules', title: { en: 'House Rules', jp: 'ハウスルール' }, icon: 'cancel' },
    { id: 'faq', title: { en: 'FAQ', jp: 'よくある質問' }, icon: 'receipt' }
];

let activeCategory = 'access';

function renderGuidebook() {
    renderPropertyInfo();
    renderSections();
    renderServices();

    // Re-render nav if active (e.g. language switch)
    renderTopNav();
    renderSidebar(activeCategory);

    initAccordions();
    initSearch();
    if (window.updateContent) window.updateContent();

    // Re-apply visibility rules for the active category (preserving scroll)
    switchCategory(activeCategory, true);
}

// Render Top Horizontal Navigation
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

// Switch Category (Tabbed View Logic)
window.switchCategory = function (catId, preserveScroll = false) {
    activeCategory = catId;

    // 1. Update Top Nav Active State
    renderTopNav(); // Simple re-render to update active class

    // 2. Show/Hide Sections (Tab behavior)
    // Hide all main containers first
    const layout = document.querySelector('.guidebook-layout');
    const hero = document.querySelector('.guidebook-hero');
    const isAccess = (catId === 'access');

    if (hero) hero.style.display = isAccess ? 'block' : 'none';
    if (layout) {
        if (isAccess) {
            layout.classList.add('has-hero');
        } else {
            layout.classList.remove('has-hero');
        }
    }

    // Reset scroll position to top when switching categories manually
    // If preserveScroll is true (e.g. used by navigateToItem), we skip this
    if (!preserveScroll) {
        window.scrollTo({ top: 0, behavior: 'auto' }); // Instant jump preferred for tab switch, or smooth
    }

    // Info components
    const propertyInfo = document.getElementById('property-info'); // Note: property-info ID might not exist in HTML yet, relying on Hero mainly for 'info'

    // Access
    const access = document.getElementById('access');
    if (access) access.style.display = (catId === 'access') ? 'block' : 'none';

    // Services
    const services = document.getElementById('services');
    if (services) services.style.display = (catId === 'services') ? 'block' : 'none';

    // Dynamic Sections
    document.querySelectorAll('.guidebook-section.dynamic-section').forEach(sec => {
        sec.style.display = 'none';
    });

    // Show target dynamic section
    const targetSection = document.getElementById(`section-${catId}`);
    if (targetSection) targetSection.style.display = 'block';

    // 3. Update Sidebar (Sub-navigation)
    renderSidebar(catId);

    // 4. Scroll active nav item into view (Center it)
    if (!preserveScroll) {
        scrollActiveNavIntoView();

        // 5. Scroll to top
        window.scrollTo(0, 0);
    }
}

function scrollActiveNavIntoView() {
    const container = document.querySelector('.top-nav-scroll');
    const activeItem = container ? container.querySelector('.top-nav-item.active') : null;

    if (activeItem) {
        // Use modern scrollIntoView with inline: 'center' to handle horizontal centering
        activeItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Render Sidebar (Sub-items of the active category)
function renderSidebar(catId) {
    const sidebarList = document.querySelector('.sidebar-nav');
    if (!sidebarList) return;

    let html = '';

    if (catId === 'access' && guidebookData.access && guidebookData.access.items) {
        guidebookData.access.items.forEach((item, index) => {
            const itemTitle = getLocalizedText(item.title);
            const icon = ICONS[item.icon] || '';
            html += `
                <a href="#" class="sidebar-subitem" onclick="scrollToId('item-access-${index}', event)">
                    ${icon} ${itemTitle}
                </a>
            `;
        });
    } else if (catId === 'services') {
        guidebookData.services.forEach(service => {
            const icon = ICONS[service.icon] || ICONS.amenities || '';
            html += `
                <a href="#" class="sidebar-subitem" onclick="scrollToId('service-${service.id}', event)">
                    ${icon} ${getLocalizedText(service.name)}
                </a>
            `;
        });
    } else {
        // For Facilities, Rules, FAQ etc.
        const section = guidebookData.sections.find(s => s.id === catId);
        section.items.forEach((item, index) => {
            const icon = ICONS[item.icon] || '';
            const scrollId = item.id || `item-${catId}-${index}`;
            html += `
                    <button class="sidebar-subitem" style="background:none; border:none; width:100%; text-align:left; cursor:pointer;" onclick="scrollToId('${scrollId}', event)">
                        ${icon} ${getLocalizedText(item.title)}
                    </button>
                `;
        });
    }

    sidebarList.innerHTML = html;
}

// Helper for offsets (Header + TopNav + Buffer)
const SCROLL_OFFSET_MOBILE = 150;
const SCROLL_OFFSET_DESKTOP = 160;

function getScrollOffset() {
    if (window.innerWidth <= 768) return 180;

    // Dynamically measure header and nav heights for accuracy
    const header = document.querySelector('.guidebook-header');
    const topNav = document.querySelector('.top-nav-container');

    let totalOffset = 0;
    if (header) totalOffset += header.offsetHeight;
    if (topNav) totalOffset += topNav.offsetHeight;

    // Add a comfortable buffer (20px)
    return totalOffset + 20;
}

// Helper for smooth scrolling within the tab
window.scrollToId = function (id, event) {
    if (event) event.preventDefault();

    // Close sidebar if open (mobile)
    const sidebar = document.getElementById('guidebook-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.getElementById('sidebar-toggle')?.classList.remove('active');
        document.querySelector('.sidebar-overlay')?.classList.remove('visible');
    }

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            // Force manual calculation to guarantee offset
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - getScrollOffset();

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Also open accordion if it is one
            if (el.classList.contains('accordion-item')) {
                el.classList.add('open');
            }
        }
    }, 300);
}

window.scrollToElement = function (id) {
    const el = document.getElementById(id);
    if (el) {
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - getScrollOffset();

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderPropertyInfo() {
    const propertyNameEl = document.getElementById('property-name');
    const heroImage = document.querySelector('.hero-image');
    console.log("Hero Image Element Found:", heroImage);
    const welcomeMessageEl = document.getElementById('welcome-message');

    if (propertyNameEl) {
        propertyNameEl.textContent = guidebookData.propertyName;
    }
    // Targeted update for the real hero image element
    const heroEl = document.querySelector('.guidebook-hero img');
    if (heroEl && window.guidebookData.heroImage) {
        heroEl.src = window.guidebookData.heroImage;
        console.log("Real hero element updated:", heroEl);
    }
    if (welcomeMessageEl && guidebookData.welcomeMessage) {
        welcomeMessageEl.textContent = getLocalizedText(guidebookData.welcomeMessage);
    }
}

function renderSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;

    let html = '';
    const lang = getLang();
    const t = window.translations ? window.translations[lang] : {};

    // Render Access section first (now as expanded cards)
    if (guidebookData.access && guidebookData.access.items) {
        const accessTitle = getLocalizedText(guidebookData.access.title);
        html += `
                                                                                        <section class="guidebook-section" id="access">
                                                                                            <h2 class="section-title">${accessTitle}</h2>
                                                                                            <div class="content-cards">
                                                                                                ${guidebookData.access.items.map((item, index) => {
            const itemTitle = getLocalizedText(item.title) || item.title;
            const itemContent = getLocalizedText(item.content) || item.content;
            const iconHtml = item.icon && ICONS[item.icon] ? ICONS[item.icon] : '';
            return `
                            <div class="content-card" id="item-access-${index}">
                                <h3 class="card-header">${iconHtml} ${itemTitle}</h3>
                                <div class="card-body">
                                    ${itemContent}
                                </div>
                            </div>
                        `;
        }).join('')}
                                                                                            </div>
                                                                                        </section>
                                                                                        `;
    }

    // Render expanded card sections
    guidebookData.sections.forEach(section => {
        const sectionTitle = getLocalizedText(section.title) || section.title;
        html += `
                                                                                        <section class="guidebook-section dynamic-section" id="section-${section.id}">
                                                                                            <h2 class="section-title">${sectionTitle}</h2>
                                                                                            <div class="content-cards">
                                                                                                ${section.items.map((item, index) => {
            const itemTitle = getLocalizedText(item.title) || item.title;
            const itemContent = getLocalizedText(item.content) || item.content;
            const iconHtml = item.icon && ICONS[item.icon] ? ICONS[item.icon] : '';

            const itemId = item.id || `item-${section.id}-${index}`;

            // Check if this is a Dining section header
            const isDiningHeader = itemTitle.startsWith("Dining") || itemTitle.includes("食事");
            const headerClass = isDiningHeader ? "card-header gold-underline dining-header" : "card-header";

            if (item.collapsible) {
                return `
                            <details class="content-card living-accordion" id="${itemId}" open>
                                <summary class="${headerClass}" style="justify-content: space-between;">${iconHtml} ${itemTitle}</summary>
                                <div class="card-body">
                                    ${itemContent}
                                </div>
                            </details>
                        `;
            } else {
                return `
                            <div class="content-card" id="${itemId}">
                                <h3 class="${headerClass}">${iconHtml} ${itemTitle}</h3>
                                <div class="card-body">
                                    ${itemContent}
                                </div>
                            </div>
                        `;
            }
        }).join('')}
                                                                                            </div>
                                                                                        </section>
                                                                                        `;
    });

    container.innerHTML = html;
}

function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    const lang = getLang();
    const t = window.translations ? window.translations[lang] : {};
    const reserveText = t['guidebook.services.reserve'] || 'Reserve';

    const html = guidebookData.services.map(service => {
        const serviceName = getLocalizedText(service.name);
        const serviceDesc = getLocalizedText(service.description);
        return `
                                                                                        <div class="service-card">
                                                                                            <img src="${service.image}" alt="${serviceName}" class="service-image" loading="lazy">
                                                                                                <div class="service-info">
                                                                                                    <h3 class="service-name">${serviceName}</h3>
                                                                                                    <p class="service-desc">${serviceDesc}</p>
                                                                                                    <p class="service-price">¥${service.price.toLocaleString()}</p>
                                                                                                    <button class="service-btn" onclick="handleServiceClick(${service.id})">${reserveText}</button>
                                                                                                </div>
                                                                                        </div>
                                                                                        `;
    }).join('');

    grid.innerHTML = html;
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all items in the same accordion (optional - remove for multi-open)
            // const accordion = item.parentElement;
            // accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
            } else {
                item.classList.add('open');
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Keep sidebar toggle logic for mobile
    const sidebar = document.getElementById('guidebook-sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            toggle.classList.toggle('active');
            if (overlay) overlay.classList.toggle('visible');
        });

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                toggle.classList.remove('active');
                overlay.classList.remove('visible');
            });
        }
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

// Global search index to prevent stale closures
let searchIndex = [];

function initSearch() {
    const searchInput = document.getElementById('guidebook-search');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Build initial index
    updateSearchIndex();

    // Prevent duplicate listeners
    if (searchInput.dataset.searchInitialized) {
        // Update placeholder only
        updateSearchPlaceholder(searchInput);
        return;
    }

    // Debounce function
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            // Use the global searchIndex which is updated on language toggle
            const results = performSearch(query, searchIndex);
            renderSearchResults(results, query, searchResults);
        }, 200);
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search')) {
            searchResults.classList.remove('active');
        }
    });

    // Mark as initialized
    searchInput.dataset.searchInitialized = 'true';

    // Update placeholder based on language
    updateSearchPlaceholder(searchInput);
}

function updateSearchPlaceholder(searchInput) {
    const lang = getLang();
    searchInput.placeholder = lang === 'jp' ? 'ガイドブックを検索...' : 'Search guidebook...';
}

function updateSearchIndex() {
    // Clear and rebuild
    searchIndex = [];

    // Add Access items
    if (guidebookData.access && guidebookData.access.items) {
        guidebookData.access.items.forEach((item, idx) => {
            const title = getLocalizedText(item.title);
            const content = stripHtml(getLocalizedText(item.content));
            searchIndex.push({
                id: `item-access-${idx}`,
                sectionId: 'access',
                title: title,
                content: content,
                category: getLocalizedText(guidebookData.access.title)
            });
        });
    }

    // Add other sections
    guidebookData.sections.forEach(section => {
        section.items.forEach((item, idx) => {
            const title = getLocalizedText(item.title);
            const content = stripHtml(getLocalizedText(item.content));
            searchIndex.push({
                id: `item-${section.id}-${idx}`,
                sectionId: section.id,
                title: title,
                content: content,
                category: getLocalizedText(section.title)
            });
        });
    });
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function performSearch(query, index) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    index.forEach(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const contentMatch = item.content.toLowerCase().includes(lowerQuery);

        if (titleMatch || contentMatch) {
            // Find matched context
            let context = '';
            let matchLocation = 'title';

            if (contentMatch) {
                matchLocation = 'content';
                const lowerContent = item.content.toLowerCase();
                const matchIndex = lowerContent.indexOf(lowerQuery);
                const start = Math.max(0, matchIndex - 30);
                const end = Math.min(item.content.length, matchIndex + query.length + 50);
                context = (start > 0 ? '...' : '') +
                    item.content.substring(start, end) +
                    (end < item.content.length ? '...' : '');
            }

            results.push({
                ...item,
                matchLocation,
                context,
                score: titleMatch ? 2 : 1 // Title matches score higher
            });
        }
    });

    // Sort by score (title matches first)
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 8); // Limit to 8 results
}

function renderSearchResults(results, query, container) {
    if (results.length === 0) {
        const lang = getLang();
        const noResultsText = lang === 'jp' ? '結果が見つかりません' : 'No results found';
        container.innerHTML = `<div class="search-no-results">${noResultsText}</div>`;
        container.classList.add('active');
        return;
    }

    const html = results.map(result => {
        const highlightedTitle = highlightMatch(result.title, query);
        const highlightedContext = result.context ? highlightMatch(result.context, query) : '';

        return `
                                                                                        <div class="search-result-item" onclick="navigateToSearchResult('${result.sectionId}', '${result.id}')">
                                                                                            <div class="search-result-title">${highlightedTitle}</div>
                                                                                            ${highlightedContext ? `<div class="search-result-context">${highlightedContext}</div>` : ''}
                                                                                        </div>
                                                                                        `;
    }).join('');

    container.innerHTML = html;
    container.classList.add('active');
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${ }()|[\]\\]/g, '\\$&');
}

window.navigateToSearchResult = function (sectionId, itemId) {
    // Close search results
    const searchResults = document.getElementById('search-results');
    const searchInput = document.getElementById('guidebook-search');
    if (searchResults) searchResults.classList.remove('active');
    if (searchInput) searchInput.value = '';

    // Switch to the correct category/section
    if (sectionId === 'access') {
        switchCategory('access');
    } else {
        // Find which top-nav category this section belongs to
        const section = guidebookData.sections.find(s => s.id === sectionId);
        if (section) {
            switchCategory(section.id);
        }
    }

    // Since we are navigating to a specific item, we expect scrollIntoView to handle it.
    // However, switchCategory will now reset scroll to top. 
    // We need to ensure scrollIntoView runs AFTER that reset completes.

    // Scroll to the specific item after a short delay (allow DOM to update)
    setTimeout(() => {
        const element = document.getElementById(itemId);
        if (element) {
            // Use manual offset calculation instead of scrollIntoView
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - getScrollOffset();

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Add a brief highlight effect
            element.style.boxShadow = '0 0 0 2px var(--gb-accent)';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 2000);
        }
    }, 100);
};

// ============================================
// SERVICE HANDLERS
// ============================================

function handleServiceClick(serviceId) {
    const service = guidebookData.services.find(s => s.id === serviceId);
    if (service) {
        const serviceName = getLocalizedText(service.name);
        alert(`Reserving: ${serviceName} \nPrice: ¥${service.price.toLocaleString()} \n\n(This is a demo - payment integration coming soon)`);
    }
}

// ============================================
// EXPORTS (for potential API use)
// ============================================
window.guidebookData = guidebookData;

// Helper to update the mobile language label
function updateLanguageLabel() {
    const label = document.getElementById('mobile-lang-label');
    if (label) {
        label.textContent = (window.currentLang || 'en').toUpperCase();
    }
}

// ============================================
// DINING ACCORDION HELPER
// ============================================
window.toggleDiningAccordion = function (headerElement) {
    const groupStart = headerElement.parentElement;
    const list = groupStart.querySelector('ul.guide-list');

    if (!list) return;

    // Toggle hidden items
    const hiddenItems = list.querySelectorAll('li:not(:first-child)');
    const isExpanded = headerElement.getAttribute('data-expanded') === 'true';
    const icon = headerElement.querySelector('.accordion-icon');

    if (isExpanded) {
        // Collapse
        hiddenItems.forEach(item => {
            item.style.display = 'none';
        });
        headerElement.setAttribute('data-expanded', 'false');
        if (icon) icon.textContent = '▶';
    } else {
        // Expand
        hiddenItems.forEach(item => {
            item.style.display = 'block'; // Reset to default display
        });
        headerElement.setAttribute('data-expanded', 'true');
        if (icon) icon.textContent = '▼';
    }
};

window.toggleNeighborhoodExtra = function (btn) {
    const container = btn.closest('.guidebook-section') || document.body;
    // Find the previous sibling which is the UL
    // The button is immediately after the UL in the new HTML structure
    const list = btn.previousElementSibling;

    if (!list || !list.classList.contains('neighborhood-list')) {
        console.warn('Neighborhood list not found');
        return;
    }

    const hiddenItems = list.querySelectorAll('.mobile-extra-item');
    const isExpanded = btn.getAttribute('data-expanded') === 'true';
    const textSpan = btn.querySelector('.show-more-text');
    const iconSpan = btn.querySelector('.show-more-icon');

    if (isExpanded) {
        // Collapse
        hiddenItems.forEach(item => {
            item.classList.remove('open');
        });
        btn.setAttribute('data-expanded', 'false');

        // Update text based on lang
        const lang = window.currentLang || 'en';
        if (textSpan) textSpan.textContent = lang === 'jp' ? 'その他を見る' : 'Show Others';
        if (iconSpan) iconSpan.style.transform = 'rotate(0deg)';

    } else {
        // Expand
        hiddenItems.forEach(item => {
            item.classList.add('open');
        });
        btn.setAttribute('data-expanded', 'true');

        const lang = window.currentLang || 'en';
        if (textSpan) textSpan.textContent = lang === 'jp' ? '閉じる' : 'Close';
        if (iconSpan) iconSpan.style.transform = 'rotate(180deg)';
    }
};

