/**
 * Guest Guidebook - JavaScript
 * Handles accordion functionality, navigation, and data rendering
 * Supports bilingual content (EN/JP)
 */

// Initialize language state
window.currentLang = localStorage.getItem('siteLang') || 'en';

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
const guidebookData = {
    propertyId: "557548",
    propertyName: "LAKE HOUSE Nojiriko",
    heroImage: "./img/lake_house_main.jpg",
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
                            <img src="img/tlh-keybox1.jpg" alt="Keybox Location" class="guidebook-img">
                            <img src="img/tlh-keybox2.jpg" alt="Keybox Detail" class="guidebook-img">
                        </div>`,
                    jp: `<p>玄関ドアのドアノブに設置しているキーボックスは、暗証番号「<strong>0123</strong>」で解錠できます。チェックアウト時は、鍵をキーボックスへお戻しください。</p>
                        <div class="keybox-container">
                            <img src="img/tlh-keybox1.jpg" alt="キーボックスの場所" class="guidebook-img">
                            <img src="img/tlh-keybox2.jpg" alt="キーボックス詳細" class="guidebook-img">
                        </div>`
                }
            },
            {
                icon: "wifi",
                title: { en: "WiFi", jp: "WiFi" },
                content: {
                    en: `<div class="wifi-container">
                            <div class="wifi-text">
                                <p><strong>Network 1:</strong> The Lake House - 2G</p>
                                <p><strong>Network 2:</strong> The Lake House - 5G</p>
                                <p><strong>Password:</strong> nojiriko</p>
                            </div>
                            <div class="wifi-image">
                                <img src="img/tlh-wifi.png" alt="WiFi QR Code" class="guidebook-img">
                            </div>
                        </div>`,
                    jp: `<div class="wifi-container">
                            <div class="wifi-text">
                                <p><strong>ネットワーク1:</strong> The Lake House - 2G</p>
                                <p><strong>ネットワーク2:</strong> The Lake House - 5G</p>
                                <p><strong>パスワード:</strong> nojiriko</p>
                            </div>
                            <div class="wifi-image">
                                <img src="img/tlh-wifi.png" alt="WiFi QRコード" class="guidebook-img">
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
                    en: `<p>Parking for 3 cars is available.</p>
                        <img src="./img/parking_layout.jpg" alt="Parking Layout" class="access-image">`,
                    jp: `<p>乗用車3台分を駐車できます。</p>
                        <img src="./img/parking_layout.jpg" alt="駐車場配置図" class="access-image">`
                }
            },
            {
                icon: "car",
                title: { en: "By Car", jp: "車で来る場合" },
                content: {
                    en: `<p>5 minutes from Nojiriko IC on the Joshinetsu Expressway.</p>
                        <p>Car rental is also available at Nagano Station.</p>`,
                    jp: `<p>上信越自動車道の野尻湖インターから車で5分</p>
                        <p>長野駅でレンタカーを借りることも可能です。</p>`
                }
            },
            {
                icon: "train",
                title: { en: "From Kurohime Station", jp: "黒姫駅から" },
                content: {
                    en: `<p>35 minutes from Nagano Station via Shinano Railway Kita-Shinano Line.</p>`,
                    jp: `<p>長野駅よりしなの鉄道北しなの線で35分</p>`
                }
            },
            {
                icon: "taxi",
                title: { en: "Taxi Companies (Japanese only)", jp: "タクシー会社" },
                content: {
                    en: `<p><strong>Nojiriko Taxi:</strong> <a href="tel:026-219-2829" class="phone-link">026-219-2829</a></p>
                        <p><strong>Toriigawa Kanko Taxi:</strong> <a href="tel:026-255-3155" class="phone-link">026-255-3155</a></p>`,
                    jp: `<p><strong>野尻湖タクシー（株）:</strong> <a href="tel:026-219-2829" class="phone-link">026−219−2829</a></p>
                        <p><strong>鳥居川観光タクシー（株）:</strong> <a href="tel:026-255-3155" class="phone-link">026−255−3155</a></p>`
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
                    icon: "rooms",
                    title: { en: "Toilet", jp: "トイレ" },
                    content: {
                        en: `<p>There are two separate toilets for men and women. Please use them accordingly.</p>`,
                        jp: `<p>男女別で2個あるので、使い分けてご使用ください。</p>`
                    }
                },
                {
                    icon: "tv",
                    title: { en: "Living Room", jp: "リビング" },
                    content: {
                        en: `<img src="img/room_living.jpg" alt="Living Room" class="living-image" loading="lazy" style="margin-bottom: 1rem;">
                        <p><strong>DAM Karaoke System:</strong> Equipped with 4 remotes, 2 microphones, tambourines, maracas, smoke items, and mic stands. (Available anytime, please mind volume at night.)</p>
                        <p><strong>BOSE Speakers:</strong> Bluetooth compatible.</p>
                        <p><strong>85-inch TV:</strong> Netflix, Prime Video, Hulu, U-NEXT, Rakuten TV, ABEMA available (please log in with your own account).</p>
                        <p><strong>HALO Sofa:</strong> Luxurious feather down sofa for cloud-like comfort.</p>
                        <p><strong>HALO Dining Table:</strong> Upcycled Georgian-style table made from historic British timber.</p>
                        <p><strong>DR.VRANJES Diffuser:</strong> Enjoy high-quality fragrances.</p>
                        <p><strong>Board Games:</strong> Cards and various games available.</p>`,
                        jp: `<img src="img/room_living.jpg" alt="リビングルーム" class="living-image" loading="lazy" style="margin-bottom: 1rem;">
                        <p><strong>【DAMカラオケ使い放題】</strong>大人数でもお楽しみいただけるようデンモク4つ、マイク2本、タンバリン、マラカス、スモークアイテムやマイクスタンドもご用意しております。（ご滞在中いつでもご利用いただけますが、夜間使用の際は音量にご注意下さい。）</p>
                        <p><strong>BOSEスピーカー完備</strong>(Bluetooth接続可能)</p>
                        <p><strong>85インチTV完備</strong>。NETFLIX、Prime video、hulu、U-NEXT、RakutenTV、ABEMAをご利用いただけます。（アカウントログインにつきましてはお客様ご自身でお願いいたします。）</p>
                        <p><strong>【英国家具ブランドHALOよりフェザーダウンを贅沢に使用したソファを完備】</strong>まるで雲の上にいるかのような、抜け出せなくなってしまう心地よさをご体感下さい。</p>
                        <p><strong>【英国家具ブランドHALOよりジョージアン様式のダイニングテーブルを完備】</strong>イギリスの家屋で実際に使用されていた梁や柱などの古材をアップサイクル。そのまま残された木のふしや釘の跡が味わいを増してくれます。ご友人やご家族との大切なひとときに是非ご利用下さいませ。</p>
                        <p>DR.VRANJESディフューザーの上質な香りをお楽しみいただけます。</p>
                        <p>横乗り好きオーナーこだわりアイテムもインテリアとして置かせていただいております。（壊れやすいものもございます。小さなお子様がお手を触れぬよう、ご注意願います。）</p>
                        <p>ボードゲームやトランプ等、ゲームグッズも多数ご用意しております。</p>`
                    }
                },
                {
                    icon: "rooms",
                    title: { en: "Bedrooms", jp: "寝室" },
                    content: {
                        en: `<div class="bedroom-grid">
                            <div class="bedroom-item">
                                <p><strong>Bedroom 1 (7.5 tatami):</strong> 1 Double Bed, A/C, Bedside Table, Mini Fridge</p>
                                <img src="img/room_bedroom_1.jpg" alt="Bedroom 1" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>Bedroom 2 (7.5 tatami):</strong> 2 Single Beds, A/C, Bedside Table, Mini Fridge</p>
                                <img src="img/room_bedroom_2.jpg" alt="Bedroom 2" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>Bedroom 3 (6.0 tatami):</strong> 2 Single Beds, A/C, Bedside Table</p>
                                <img src="img/room_bedroom_3.jpg" alt="Bedroom 3" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>Bedroom 4 (9.0 tatami):</strong> 2 Semi-Double Beds, A/C, Side Table, Mini Fridge, LCD TV</p>
                                <img src="img/room_bedroom_4.jpg" alt="Bedroom 4" loading="lazy">
                            </div>
                        </div>`,
                        jp: `<div class="bedroom-grid">
                            <div class="bedroom-item">
                                <p><strong>寝室①【洋室7.5帖】</strong>ダブルベッド1台、冷暖房エアコン、ベッドサイドテーブル、小型冷蔵庫</p>
                                <img src="img/room_bedroom_1.jpg" alt="寝室1" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>寝室②【洋室7.5帖】</strong>シングルベッド2台、冷暖房エアコン、ベッドサイドテーブル、小型冷蔵庫</p>
                                <img src="img/room_bedroom_2.jpg" alt="寝室2" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>寝室③【洋室6.0帖】</strong>シングルベッド2台、冷暖房エアコン、ベッドサイドテーブル</p>
                                <img src="img/room_bedroom_3.jpg" alt="寝室3" loading="lazy">
                            </div>
                            <div class="bedroom-item">
                                <p><strong>寝室④【洋室9.0帖】</strong>セミダブルベッド2台、冷暖房エアコン、サイドテーブル、小型冷蔵庫、液晶テレビ</p>
                                <img src="img/room_bedroom_4.jpg" alt="寝室4" loading="lazy">
                            </div>
                        </div>`
                    }
                },
                {
                    icon: "kitchen",
                    title: { en: "Kitchen", jp: "キッチン" },
                    content: {
                        en: `<p><strong>Unlimited Sparkling Water Server:</strong> Fresh strong carbonation on tap. Great for mixers or drinking straight (especially after sauna).</p>
                        <p><strong>HOSHIZAKI Ice Maker:</strong> Commercial-grade ice maker for crystal clear, slow-melting ice.</p>
                        <p><strong>Appliances:</strong> Panasonic 470L Fridge, T-fal 1.2L Kettle, Panasonic Microwave.</p>
                        <p><strong>Cooking:</strong> Fully cooking utensils, dishes, glasses. IH Stove (instructions below).</p>
                        <p><strong>Condiments:</strong> Oil, Salt, Pepper only.</p>
                        <p><strong>Note:</strong> Please use the provided drain net and discard after use.</p>
                        <div class="tip-box">If kitchen stove batteries die, spares are available (see image). Open cover to replace.</div>`,
                        jp: `<p><strong>【炭酸サーバー使い放題】</strong>レバーを引くだけで無限に出てくる強炭酸サーバー完備！ご自身のお好みのリキュールやお飲み物をお好きな分強炭酸水で割っていただけます。サウナ時の飲用もオススメです。</p>
                        <p><strong>【HOSHIZAKI製氷機完備】</strong>業務用製氷機を完備しております。溶けにくく大きな氷で是非快適なご飲食をお楽しみ下さい。</p>
                        <p>Panasonic 470L冷蔵庫完備、1.2Lティファール完備、Panasonic電子レンジ完備</p>
                        <p>調理器具、食器、グラス各種完備</p>
                        <p>キッチンコンロが電池切れした際は右記の画像に換えの電池があるので、2番目の画像よりカバーを開けて交換いただければと存じます。</p>
                        <p>水切りネットをセットさせていただきますので、ご使用して捨ててください</p>
                        <p>調味料は油と塩と胡椒のみ用意しております。</p>`
                    }
                },
                {
                    icon: "fire",
                    title: { en: "Fireplace", jp: "暖炉" },
                    content: {
                        en: `<p>Please watch the video guide to operate the fireplace.</p>
                        <p><strong>Important:</strong> Return gas cans to their original location. Ensure safety to prevent fire hazards.</p>`,
                        jp: `<p>こちらの動画を参考に、暖炉を付けてください。※ガス缶は元の場所に戻してください。※火災の原因にもなりますので、必ずご確認お願いいたします。</p>`
                    }
                },
                {
                    icon: "mic",
                    title: { en: "Karaoke", jp: "カラオケ" },
                    content: {
                        en: `<p>1. Switch TV input to HDMI 1.</p>
                        <p>2. Press the 3 power buttons (see image).</p>
                        <p><strong>Note:</strong> Takes about 3 minutes to boot if all power was off.</p>
                        <p>If unsure, please watch the video guide.</p>`,
                        jp: `<p>① テレビのリモコンの入力切り替えでHDMI1に合わせる。</p>
                        <p>② 3ヶ所の電源ボタンを押す→写真参照</p>
                        <p>※電源が全て切れている場合は3分ほど、起動までお時間がかかります。</p>
                        <p>わからない場合はこちらの動画をご視聴ください。</p>`
                    }
                },
                {
                    icon: "laundry",
                    title: { en: "Washing Machine", jp: "洗濯機" },
                    content: {
                        en: `<p>Follow the steps to Wash / Wash & Dry / Dry.</p>
                        <p>Manual available here.</p>`,
                        jp: `<p>こちらの手順で洗濯と乾燥が可能です。②の際に洗濯・洗乾燥・乾燥の三つよりコースがお選びできます。取扱説明書はこちら。</p>`
                    }
                },
                {
                    icon: "water",
                    title: { en: "Water Heater", jp: "給湯器" },
                    content: {
                        en: `<p>Two units located in Kitchen and Bath. Please verify images.</p>
                        <p>Set both to 60°C for use.</p>`,
                        jp: `<p>給湯器がキッチンと風呂場に2個ずつあります。画像を参照ください。双方とも60度に設定をして、お使いください。</p>`
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Jacuzzi", jp: "ジャグジー" },
                    content: {
                        en: `<p>1. Turn on switch panel next to Jacuzzi.</p>
                        <p>2. Turn on Jacuzzi power.</p>
                        <p><strong>Filling:</strong> Use the faucet (not water heater). Close Drain Valves 1 & 2.</p>
                        <p><strong>Draining:</strong> Open Drain Valves 1 & 2. Drain completely after use.</p>
                        <p><strong>Notes:</strong> No food/drink inside. Auto-fill takes too long, follow manual fill instructions.</p>
                        <p><strong>Hot Shower:</strong> Available Mar-Nov (¥10,000/day extra).</p>`,
                        jp: `<p>① ジャグジー横にあるスイッチパネルを開け電源を入れる。</p>
                        <p>② ジャグジーの電源を入れる。</p>
                        <p><strong>&lt;水を貯める&gt;</strong> 給湯器ではなくこちらの蛇口を捻ってお使いください。水を貯める場合は排水弁①と排水弁②を閉じてください</p>
                        <p><strong>&lt;排水する&gt;</strong> 排水弁①と排水弁②両方開けてください。※使用後は完全に排水をお願いします</p>
                        <p>※ジャグジー内での飲食は禁止です。※自動のお湯炊きだと時間かかるので、必ず上記の説明通りにお試しください。</p>
                        <p>【温シャワー完備】※3月~11月のみ利用可能※別途一日あたり10,000円頂いております。</p>`
                    }
                },
                {
                    icon: "sightseeing",
                    title: { en: "Balcony", jp: "バルコニー" },
                    content: {
                        en: `<p><strong>Lafuma Sauna Chairs (x4):</strong> Relax after the cold bath under the stars.</p>
                        <p><strong>Amenities:</strong> Side tables, Custom wood table, JBL PartyBox Speaker.</p>
                        <p><strong>Overhead Shower:</strong> Cold water shower available (except winter).</p>
                        <div class="warning-box">
                            <strong>Rules:</strong> Quiet hours after 10 PM. No jumping into the lake (dangerous). Do not bury alcohol in snow.
                        </div>`,
                        jp: `<p><strong>【フランス輸入サウナチェア（Lafuma MOBILIER）4台完備】</strong>こだわりの水風呂につかった後は、ゆったりとした時間をおくつろぎ下さい。</p>
                        <p>サイドテーブル2台完備、特注ウッドテーブル完備。</p>
                        <p>JBLスピーカーPartyBox完備</p>
                        <p>固定式シャワー完備（冬季使用不可）</p>
                        <div class="warning-box">
                            <strong>注意事項:</strong> 夜22時以降はバルコニーではお静かにお過ごしください。日が暮れてから、湖に飛び込むのは大変危険なので厳禁です。雪の中にお酒を埋めて冷やすのはご遠慮ください。
                        </div>`
                    }
                },
                {
                    icon: "bbq",
                    title: { en: "BBQ", jp: "BBQ" },
                    content: {
                        en: `<p>Located on the upper kitchen shelf.</p>
                        <p>1. Check position of lighter and tongs.</p>
                        <p>2. Check position of the grill net.</p>`,
                        jp: `<p>① チャッカマンとトングの位置を確認する。</p>
                        <p>② 網の位置を確認する。</p>
                        <p>③ キッチンの上部の棚にあります。</p>`
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Sauna", jp: "サウナ" },
                    content: {
                        en: `<p>Private sauna with Lake Nojiri views. Max 6 people.</p>
                        <p><strong>Equipment:</strong> HARVIA LEGEND300 Stove, Löyly Set (Birch scent), Sauna Mats, Towels, Merino Wool Hats.</p>
                        <p><strong>Items:</strong> Bose Speaker, Blower (for self-aufguss), FIRESIDE Gloves & Firestarters.</p>
                        <p><strong>Rentals:</strong> Sauna Ponchos available (paid).</p>
                        <p>Please return gas cans to basket.</p>`,
                        jp: `<p>オーナーこだわりの特注サウナルームです。最大６名。</p>
                        <p>HARVIA LEGEND300ストーブサウナ完備、ロウリュセット完備（白樺の香り）、サウナマット・タオル完備。</p>
                        <p>メリノウール100％サウナハット完備。</p>
                        <p>Boseモバイルスピーカー完備、ブロアー完備（セルフアウフグース可能）。</p>
                        <p>FIRESIDE革手袋・着火剤完備。</p>
                        <p>有料でサウナポンチョの貸し出しがある。ガス缶はカゴに戻すようにする。</p>`
                    }
                },
                {
                    icon: "water",
                    title: { en: "Cold Bath", jp: "水風呂" },
                    content: {
                        en: `<p>Custom-built 140cm deep cold bath fed by natural underground water (14°C year-round, 100L/min).</p>
                        <p>Dive in to cool down completely.</p>`,
                        jp: `<p>春夏秋冬、季節を問わず14℃の天然地下水が毎分100ℓで湧き出ているため、掛け流しで提供させていただきます。</p>
                        <p>深さなんと140cm、天然地下水掛け流しの水風呂へダイブ。</p>`
                    }
                },
                {
                    icon: "amenities",
                    title: { en: "Amenities & Tools", jp: "アメニティ・備品" },
                    content: {
                        en: `<p><strong>Bath:</strong> Shampoo, Body Soap, Conditioner, Towels, Toothbrush, Hair Dryers (x2), Jet Bath.</p>
                        <p><strong>Kitchen:</strong> Rice Cooker, Gas Stove, Tefal Pot, Pots/Pans, Dishwasher (detergent in clear box).</p>`,
                        jp: `<p><strong>アメニティ:</strong> シャンプー、ボディソープ、コンディショナー、バスタオル、ボディタオル、歯ブラシ。</p>
                        <p><strong>調理器具:</strong> 炊飯器、ガスコンロ、Tefal 電気ポット、鍋、フライパン。</p>
                        <p><strong>食洗機:</strong> 透明のボックスの中に洗剤が入っています。食器と一緒に中に入れてください。電源を先に押してオンにした後にスタートを押してください。</p>
                        <p><strong>お風呂:</strong> ジェットバス付き浴槽完備、浴室内5段階調光完備、ヘアドライヤー2台完備。</p>`
                    }
                },
                {
                    icon: "power",
                    title: { en: "Breaker", jp: "ブレーカー" },
                    content: {
                        en: `<p>Located as shown in image. Reset any switches that are down.</p>`,
                        jp: `<p>こちらの画像の場所にブレーカーがあります。下がっているスイッチを直してください。</p>`
                    }
                },
                {
                    icon: "trash",
                    title: { en: "Trash Rules", jp: "ゴミ箱" },
                    content: {
                        en: `<p>Separate into: Burnable, Non-burnable, Cans, PET bottles, Glass.</p>
                        <p>Place in designated area (red frame in image).</p>
                        <p>Consolidate trash near living room red frame area upon checkout.</p>
                        <p>Long-term guests: Contact via booking site for collection.</p>`,
                        jp: `<p>ゴミは可燃ゴミ、不燃ゴミ、缶、ペットボトル、瓶で分別して画像の赤枠付近に置いてください。</p>
                        <p>ゴミ箱は1点のみご使用になれます。</p>
                        <p>退出時にリビングに右記の画像の赤枠周辺にまとめてゴミを置いておいてください。</p>
                        <p>長期宿泊のお客様はゴミを回収させていただきますので、お使いの予約サイトよりご連絡をしてください。</p>`
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
                        en: `<ul class="guide-list">
                                <li><strong>7-Eleven Nojiriko</strong> (3 min drive / 25 min walk)<br><a href="https://maps.app.goo.gl/G9RWM8weuvCBwHWE8" target="_blank">View Map</a></li>
                                <li><strong>Gas Station ENEOS Nojiriko SS</strong> (3 min drive)<br><a href="https://maps.app.goo.gl/AwKBxDQRZknxXWaUA" target="_blank">View Map</a></li>
                                <li><strong>7-Eleven Shinanomachi Furuma</strong> (10 min drive)<br><a href="https://maps.app.goo.gl/MWjSvAo96oqHvm9m7" target="_blank">View Map</a></li>
                                <li><strong>Matsumoto Kiyoshi</strong> (Drugstore, 10 min drive)<br><a href="https://maps.app.goo.gl/RsZJ9Vxb7pGENTUQ7" target="_blank">View Map</a></li>
                                <li><strong>Komeri</strong> (Home Center, 10 min drive)<br><a href="https://maps.app.goo.gl/qUL7xc5uUWoJMPw79" target="_blank">View Map</a></li>
                                <li><strong>Minemura Sake Shop</strong> (10 min drive)<br><a href="https://maps.app.goo.gl/GmhirMwhEaAkA3SRA" target="_blank">View Map</a></li>
                                <li><strong>Daiichi Supermarket</strong> (10 min drive)<br><a href="https://maps.app.goo.gl/oroYjsQDXvs9zWwn6" target="_blank">View Map</a></li>
                            </ul>`,
                        jp: `<ul class="guide-list">
                                <li><strong>セブンイレブン野尻湖店</strong> (車で3分 徒歩25分)<br><a href="https://maps.app.goo.gl/G9RWM8weuvCBwHWE8" target="_blank">地図を見る</a></li>
                                <li><strong>ガソリンスタンドENEOS 野尻湖SS</strong> (車で3分)<br><a href="https://maps.app.goo.gl/AwKBxDQRZknxXWaUA" target="_blank">地図を見る</a></li>
                                <li><strong>セブンイレブン信濃町古間店</strong> (車で10分)<br><a href="https://maps.app.goo.gl/MWjSvAo96oqHvm9m7" target="_blank">地図を見る</a></li>
                                <li><strong>マツモトキヨシ古間店</strong> (車で10分)<br><a href="https://maps.app.goo.gl/RsZJ9Vxb7pGENTUQ7" target="_blank">地図を見る</a></li>
                                <li><strong>ホームセンターコメリ 信濃町店</strong> (車で10分)<br><a href="https://maps.app.goo.gl/qUL7xc5uUWoJMPw79" target="_blank">地図を見る</a></li>
                                <li><strong>みねむら酒店</strong> (車で10分)<br><a href="https://maps.app.goo.gl/GmhirMwhEaAkA3SRA" target="_blank">地図を見る</a></li>
                                <li><strong>スーパーマーケット第一スーパー古間店</strong> (車で10分)<br><a href="https://maps.app.goo.gl/oroYjsQDXvs9zWwn6" target="_blank">地図を見る</a></li>
                            </ul>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Dining: Western & Cafe", jp: "食事：洋食・カフェ" },
                    content: {
                        en: `<h4 class="guide-sub-title">Italian</h4>
                            <ul class="guide-list">
                                <li><strong>Funagoya</strong><br><a href="https://maps.app.goo.gl/UTGMEnHbVUd4nEMt9" target="_blank">View Map</a></li>
                                <li><strong>Terra</strong><br><a href="https://maps.app.goo.gl/bvsg8gmxt7ARfFV78" target="_blank">View Map</a></li>
                                <li><strong>Nicoli</strong><br><a href="https://maps.app.goo.gl/3PXMN6TghEhUyzEp7" target="_blank">View Map</a></li>
                                <li><strong>Restaurant Rudolf</strong><br><a href="https://maps.app.goo.gl/C2N41Ku3MATQNBcF8" target="_blank">View Map</a></li>
                            </ul>
                            <h4 class="guide-sub-title">Hamburger & Western</h4>
                            <ul class="guide-list">
                                <li><strong>Lamp Nojiriko</strong><br><a href="https://maps.app.goo.gl/WjK4gYTUV2uPQpms5" target="_blank">View Map</a></li>
                                <li><strong>Arrowhead Tavern</strong><br><a href="https://maps.app.goo.gl/Yi2MTGhadx9iZQaw9" target="_blank">View Map</a></li>
                                <li><strong>Lumber jack</strong><br><a href="https://maps.app.goo.gl/woFffzQ9f1bkPExx8" target="_blank">View Map</a></li>
                            </ul>
                            <h4 class="guide-sub-title">Cafe & Bakery</h4>
                            <ul class="guide-list">
                                <li><strong>MYOKO COFFEE</strong><br><a href="https://maps.app.goo.gl/ZfZi2q3FnZJDHYt19" target="_blank">View Map</a></li>
                                <li><strong>EN Bakery 39</strong><br><a href="https://maps.app.goo.gl/H1krSAdkcu498NXM6" target="_blank">View Map</a></li>
                            </ul>`,
                        jp: `<h4 class="guide-sub-title">イタリアン</h4>
                            <ul class="guide-list">
                                <li><strong>Funagoya舟小屋</strong><br><a href="https://maps.app.goo.gl/UTGMEnHbVUd4nEMt9" target="_blank">地図を見る</a></li>
                                <li><strong>イタリア料理 テルラ</strong><br><a href="https://maps.app.goo.gl/bvsg8gmxt7ARfFV78" target="_blank">地図を見る</a></li>
                                <li><strong>Nicoli</strong><br><a href="https://maps.app.goo.gl/3PXMN6TghEhUyzEp7" target="_blank">地図を見る</a></li>
                                <li><strong>レストランルドルフ</strong><br><a href="https://maps.app.goo.gl/C2N41Ku3MATQNBcF8" target="_blank">地図を見る</a></li>
                            </ul>
                            <h4 class="guide-sub-title">ハンバーガー・洋食</h4>
                            <ul class="guide-list">
                                <li><strong>Lamp野尻湖</strong><br><a href="https://maps.app.goo.gl/WjK4gYTUV2uPQpms5" target="_blank">地図を見る</a></li>
                                <li><strong>Arrowhead Tavern</strong><br><a href="https://maps.app.goo.gl/Yi2MTGhadx9iZQaw9" target="_blank">地図を見る</a></li>
                                <li><strong>Lumber jack</strong><br><a href="https://maps.app.goo.gl/woFffzQ9f1bkPExx8" target="_blank">地図を見る</a></li>
                            </ul>
                            <h4 class="guide-sub-title">カフェ・パン屋</h4>
                            <ul class="guide-list">
                                <li><strong>MYOKO COFFEE 高原駅前</strong><br><a href="https://maps.app.goo.gl/ZfZi2q3FnZJDHYt19" target="_blank">地図を見る</a></li>
                                <li><strong>EN　ベーカリー39</strong><br><a href="https://maps.app.goo.gl/H1krSAdkcu498NXM6" target="_blank">地図を見る</a></li>
                            </ul>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Dining: Japanese & Asian", jp: "食事：和食・中華・その他" },
                    content: {
                        en: `<h4 class="guide-sub-title">Japanese (Soba, etc.)</h4>
                            <ul class="guide-list">
                                <li><strong>Issa Shokudo</strong><br><a href="https://maps.app.goo.gl/XLfyapZ5Q18Sbtfx6" target="_blank">View Map</a></li>
                                <li><strong>Shinanoya (Soba)</strong><br><a href="https://maps.app.goo.gl/ygT2EQkCH6XDHxE68" target="_blank">View Map</a></li>
                                <li><strong>Restaurant Kiju</strong><br><a href="https://maps.app.goo.gl/uDQRMJ9VLrtyq6Pt5" target="_blank">View Map</a></li>
                                <li><strong>Sobadokoro Takasawa</strong><br><a href="https://maps.app.goo.gl/VDjwwczuSCyfd3bj7" target="_blank">View Map</a></li>
                                <li><strong>Jurin (Tonkatsu)</strong><br><a href="https://maps.app.goo.gl/5VVSB9mKbypkdTtt8" target="_blank">View Map</a></li>
                                <li><strong>Kirakuen</strong><br><a href="https://maps.app.goo.gl/v2sRJLwR4KmqceD27" target="_blank">View Map</a></li>
                            </ul>
                            <h4 class="guide-sub-title">Sushi & Yakiniku</h4>
                            <ul class="guide-list">
                                <li><strong>Kitokito Sushi</strong><br><a href="https://maps.app.goo.gl/YQjLdV7eNGG9yF6E9" target="_blank">View Map</a></li>
                                <li><strong>Yakiniku Toyooka</strong><br><a href="https://maps.app.goo.gl/LxeKEXAFVqEAAJ4f9" target="_blank">View Map</a></li>
                                <li><strong>Echigoya</strong><br><a href="https://maps.app.goo.gl/3gspUgVzZQreVQ8Z7" target="_blank">View Map</a></li>
                                <li><strong>Yakiniku Otagiri</strong><br><a href="https://maps.app.goo.gl/u5Lh6yn9c2V2ErtZ8" target="_blank">View Map</a></li>
                            </ul>
                            <h4 class="guide-sub-title">Chinese & Ramen</h4>
                            <ul class="guide-list">
                                <li><strong>Eika (Machichuka)</strong><br><a href="https://maps.app.goo.gl/GKcWKjfZFrXxD9xP9" target="_blank">View Map</a></li>
                                <li><strong>Arakin Ramen</strong><br><a href="https://maps.app.goo.gl/royTk9WKLCv81MS49" target="_blank">View Map</a></li>
                            </ul>
                            <h4 class="guide-sub-title">Izakaya</h4>
                            <ul class="guide-list">
                                <li><strong>Tamaki</strong><br><a href="https://maps.app.goo.gl/QCEC39Y7BKbni2u9A" target="_blank">View Map</a></li>
                                <li><strong>Nihontei</strong><br><a href="https://maps.app.goo.gl/AevwtYUQZE3ZgBXq6" target="_blank">View Map</a></li>
                            </ul>`,
                        jp: `<h4 class="guide-sub-title">和食</h4>
                            <ul class="guide-list">
                                <li><strong>一茶食堂</strong><br><a href="https://maps.app.goo.gl/XLfyapZ5Q18Sbtfx6" target="_blank">地図を見る</a></li>
                                <li><strong>信濃屋 そば</strong><br><a href="https://maps.app.goo.gl/ygT2EQkCH6XDHxE68" target="_blank">地図を見る</a></li>
                                <li><strong>レストラン樹香</strong><br><a href="https://maps.app.goo.gl/uDQRMJ9VLrtyq6Pt5" target="_blank">地図を見る</a></li>
                                <li><strong>そば処 たかさわ</strong><br><a href="https://maps.app.goo.gl/VDjwwczuSCyfd3bj7" target="_blank">地図を見る</a></li>
                                <li><strong>樹林とんかつ</strong><br><a href="https://maps.app.goo.gl/5VVSB9mKbypkdTtt8" target="_blank">地図を見る</a></li>
                                <li><strong>きらく園</strong><br><a href="https://maps.app.goo.gl/v2sRJLwR4KmqceD27" target="_blank">地図を見る</a></li>
                            </ul>
                            <h4 class="guide-sub-title">寿司・焼肉</h4>
                            <ul class="guide-list">
                                <li><strong>きときと寿司</strong><br><a href="https://maps.app.goo.gl/YQjLdV7eNGG9yF6E9" target="_blank">地図を見る</a></li>
                                <li><strong>精肉焼肉とよおか</strong><br><a href="https://maps.app.goo.gl/LxeKEXAFVqEAAJ4f9" target="_blank">地図を見る</a></li>
                                <li><strong>越後屋</strong><br><a href="https://maps.app.goo.gl/3gspUgVzZQreVQ8Z7" target="_blank">地図を見る</a></li>
                                <li><strong>焼肉おたぎり</strong><br><a href="https://maps.app.goo.gl/u5Lh6yn9c2V2ErtZ8" target="_blank">地図を見る</a></li>
                            </ul>
                            <h4 class="guide-sub-title">中華・ラーメン</h4>
                            <ul class="guide-list">
                                <li><strong>栄華 町中華</strong><br><a href="https://maps.app.goo.gl/GKcWKjfZFrXxD9xP9" target="_blank">地図を見る</a></li>
                                <li><strong>あらきんラーメン</strong><br><a href="https://maps.app.goo.gl/royTk9WKLCv81MS49" target="_blank">地図を見る</a></li>
                            </ul>
                            <h4 class="guide-sub-title">居酒屋</h4>
                            <ul class="guide-list">
                                <li><strong>町酒場 たまき</strong><br><a href="https://maps.app.goo.gl/QCEC39Y7BKbni2u9A" target="_blank">地図を見る</a></li>
                                <li><strong>日本亭</strong><br><a href="https://maps.app.goo.gl/AevwtYUQZE3ZgBXq6" target="_blank">地図を見る</a></li>
                            </ul>`
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Onsen & Sauna", jp: "温泉・サウナ" },
                    content: {
                        en: `<ul class="guide-list">
                                <li><strong>Madarao no Yu</strong> (Tattoo friendly)<br><a href="https://maps.app.goo.gl/YmcpSpDAjNMbH1ND9" target="_blank">View Map</a></li>
                                <li><strong>THE SAUNA</strong><br><a href="https://maps.app.goo.gl/f2GPWJpnjmtHuHWQ8" target="_blank">View Map</a></li>
                            </ul>`,
                        jp: `<ul class="guide-list">
                                <li><strong>まだらおの湯</strong> (タトゥーOK)<br><a href="https://maps.app.goo.gl/YmcpSpDAjNMbH1ND9" target="_blank">地図を見る</a></li>
                                <li><strong>THE SAUNA</strong><br><a href="https://maps.app.goo.gl/f2GPWJpnjmtHuHWQ8" target="_blank">地図を見る</a></li>
                            </ul>`
                    }
                },
                {
                    icon: "sightseeing",
                    title: { en: "Ski Resorts", jp: "スキー場" },
                    content: {
                        en: `<div class="resort-list">
                                <div class="resort-item">
                                    <strong>Seki Onsen Ski Resort</strong> (20 min drive)<br>
                                    <p class="resort-desc">Famous for heavy snow and powder. Advanced/Expert friendly with many non-groomed areas. Quiet and uncrowded.</p>
                                    <a href="https://maps.app.goo.gl/UvR1L72DBz7xh8ei9" target="_blank">part_link</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Myoko Kogen / Akakura Onsen</strong> (15 min drive)<br>
                                    <p class="resort-desc">Wide variety of courses from beginner to advanced. Connected to Akakura Onsen town with great après-ski. Popular international resort.</p>
                                    <a href="https://maps.app.goo.gl/e4FE18NLo76F4yde6" target="_blank">View Map</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Kurohime Kogen Snow Park</strong> (10 min drive)<br>
                                    <p class="resort-desc">Gentle slopes ideal for families and beginners. Excellent kids park and ski school. Uncrowded and relaxed.</p>
                                    <a href="https://maps.app.goo.gl/6Sjiz78maGxLj2aD6" target="_blank">View Map</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Tangram Ski Circus</strong> (14 min drive)<br>
                                    <p class="resort-desc">All-in-one resort with hotel. Perfect for beginners and families. Offers activities beyond skiing.</p>
                                    <a href="https://maps.app.goo.gl/1oPx6GfS8E4DnXXZA" target="_blank">View Map</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Madarao Kogen Ski Resort</strong> (22 min drive)<br>
                                    <p class="resort-desc">Known for the highest number of tree run courses in Japan. Popular for powder and backcountry lovers. Intermediate to Advanced.</p>
                                    <a href="https://maps.app.goo.gl/Bp4w27e8xNyrm1RV6" target="_blank">View Map</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Nozawa Onsen Ski Resort</strong> (45 min drive)<br>
                                    <p class="resort-desc">Large scale resort with long runs. Historic onsen town atmosphere with free public baths. Great for sightseeing and skiing.</p>
                                    <a href="https://maps.app.goo.gl/zxcZVxCCdwNSAaXx6" target="_blank">View Map</a>
                                </div>
                                <div class="resort-item">
                                    <strong>Shiga Kogen Ski Resort</strong> (55 min drive)<br>
                                    <p class="resort-desc">Japan's largest ski area (18 resorts). High altitude and stable snow quality. For advanced skiers and long stays.</p>
                                    <a href="https://maps.app.goo.gl/bDKF6hhpRqY1RVoJA" target="_blank">View Map</a>
                                </div>
                            </div>`,
                        jp: `<div class="resort-list">
                                <div class="resort-item">
                                    <strong>関温泉スキー場</strong> (車で20分)<br>
                                    <p class="resort-desc">豪雪×上級者向けで有名なローカルスキー場。非圧雪エリアが多く、パウダースノー好き・玄人向け。観光客が少なく、静かに滑りたい人に最適。</p>
                                    <a href="https://maps.app.goo.gl/UvR1L72DBz7xh8ei9" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>妙高高原・赤倉温泉スキー場</strong> (車で15分)<br>
                                    <p class="resort-desc">コースバリエーションが豊富で初級〜上級まで対応。ゲレンデ直結の赤倉温泉街があり、アフタースキーも充実。外国人観光客にも人気の国際的リゾート。</p>
                                    <a href="https://maps.app.goo.gl/e4FE18NLo76F4yde6" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>黒姫高原スノーパーク</strong> (車で10分)<br>
                                    <p class="resort-desc">ファミリー・初心者向けの緩やかなコース設計。キッズパークやスクールが充実。混雑しにくく、気軽に楽しめるスキー場。</p>
                                    <a href="https://maps.app.goo.gl/6Sjiz78maGxLj2aD6" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>タングラムスキーサーカス</strong> (車で14分)<br>
                                    <p class="resort-desc">ホテル一体型のオールインワンリゾート。初心者・ファミリー・観光目的の人に最適。スキー以外（温泉・アクティビティ）も楽しめる。</p>
                                    <a href="https://maps.app.goo.gl/1oPx6GfS8E4DnXXZA" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>斑尾高原スキー場</strong> (車で22分)<br>
                                    <p class="resort-desc">日本有数のツリーランコース数を誇る。パウダー・バックカントリー好きに大人気。中〜上級者向け、滑りごたえ重視。</p>
                                    <a href="https://maps.app.goo.gl/Bp4w27e8xNyrm1RV6" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>野沢温泉スキー場</strong> (車で45分)<br>
                                    <p class="resort-desc">コース規模が大きく、長距離滑走が可能。歴史ある野沢温泉街と外湯巡りが魅力。スキー×温泉×街歩きを楽しみたい人向け。</p>
                                    <a href="https://maps.app.goo.gl/zxcZVxCCdwNSAaXx6" target="_blank">地図を見る</a>
                                </div>
                                <div class="resort-item">
                                    <strong>志賀高原スキー場</strong> (車で55分)<br>
                                    <p class="resort-desc">日本最大級のスキーエリア（18スキー場連結）。標高が高く、雪質が安定している。上級者・長期滞在・本格派スキーヤー向け。</p>
                                    <a href="https://maps.app.goo.gl/bDKF6hhpRqY1RVoJA" target="_blank">地図を見る</a>
                                </div>
                            </div>`
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
                    icon: "cancel",
                    title: { en: "Prohibited Acts", jp: "禁止行為" },
                    content: {
                        en: `<p><strong>Unauthorized Extension:</strong> Please adhere to check-in/out times. ¥10,000 per 30 min charged for unauthorized extensions.</p>
                        <p><strong>Fire:</strong> Use of fire indoors is prohibited (except kitchen stove).</p>
                        <p><strong>Restricted Areas:</strong> Guests are not allowed on the 3rd floor.</p>`,
                        jp: `<p><strong>無断延長:</strong> 予約時間内の入退室をお願いします。無断延長は30分につき1万円を請求します。</p>
                        <p><strong>火気の利用:</strong> 室内での火気利用は禁止です（キッチンコンロを除く）。</p>
                        <p><strong>立入禁止:</strong> 3階は管理上の理由により立ち入りできません。</p>`
                    }
                },
                {
                    icon: "info",
                    title: { en: "Important Notes", jp: "注意事項" },
                    content: {
                        en: `<ul class="guide-list">
                            <li>Do not take amenities home. You may be charged for missing items.</li>
                            <li>Do not wear shoes indoors.</li>
                            <li>Be mindful of noise when windows/door are open.</li>
                            <li>Restrooms (men/women separate) are on the 1st floor.</li>
                            <li>No security cameras. Please manage your own valuables.</li>
                            <li>Please respect our neighbors.</li>
                        </ul>`,
                        jp: `<ul class="guide-list">
                            <li>備品は持ち帰らないでください。無断持ち出しは請求対象となる場合があります。</li>
                            <li>靴で室内には入らないでください。</li>
                            <li>窓、玄関を開放しての騒音はご注意ください。</li>
                            <li>お手洗い、トイレは1階(男女別)をご利用くださいませ。</li>
                            <li>防犯カメラは設置しておりません。貴重品の管理はご利用者様で行ってください。</li>
                            <li>周辺住人に対しての迷惑行為はお控えください。</li>
                        </ul>`
                    }
                },
                {
                    icon: "money",
                    title: { en: "Pricing", jp: "料金体系" },
                    content: {
                        en: `<p><strong>Capacity:</strong> Up to 8 guests (Adults + Children).</p>
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
                        en: `<ul class="guide-list">
                            <li>① Return furniture/items to original layout.</li>
                            <li>② Separate trash (see guidelines).</li>
                            <li>③ Empty fridge (take all food home).</li>
                            <li>④ Turn off AC and lights.</li>
                            <li>⑤ Check for personal belongings (cables, fridge, clothes).</li>
                            <li>⑥ Report any lost or broken items.</li>
                        </ul>`,
                        jp: `<ul class="guide-list">
                            <li>① 机や椅子、小物を動かされた場合は、元のレイアウトに戻してください</li>
                            <li>② ゴミ類は分別して置いてください</li>
                            <li>③ 残った食材は冷蔵庫に残さず、全てお持ち帰りください</li>
                            <li>④ エアコン、電気等の電源をオフにしてください</li>
                            <li>⑤ 忘れ物はありませんか?(充電ケーブル/冷蔵庫内/傘/洋服 等)</li>
                            <li>⑥ 備品の紛失、破損等があった場合はご連絡をお願い致します</li>
                        </ul>`
                    }
                },
                {
                    icon: "phone",
                    title: { en: "Emergency Contact", jp: "緊急連絡先" },
                    content: {
                        en: `<p><strong>Manager (Kobayashi):</strong> 090-9357-5586</p>`,
                        jp: `<p><strong>管理者 (小林):</strong> 090-9357-5586</p>`
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
                        en: `<p><strong>OTA Bookings:</strong> Please contact the OTA (Booking.com, Airbnb, etc.) directly.</p>
                        <p><strong>Official Site Bookings:</strong> Please contact us via chat or the email you used for booking.</p>`,
                        jp: `<p><strong>OTAからご予約の場合:</strong> 各OTAにお問い合わせください。</p>
                        <p><strong>公式サイトからのご予約の場合:</strong> チャットまたはご予約いただいたメールアドレスからお問い合わせください。</p>`
                    }
                },
                {
                    icon: "bath",
                    title: { en: "No Hot Water (Bath/Kitchen)", jp: "風呂かキッチンからお湯が流れないです" },
                    content: {
                        en: `<p>Please turn ON both the bath and kitchen water heater panels as shown in the image.</p>
                        <p><strong>Note:</strong> If the "Priority" (優先) button is pressed in the bathroom, hot water may not be available in the kitchen. Please understand this is a system specification.</p>
                        <div class="tip-box fa-tip">
                            <strong>Winter Warning:</strong> Heavy snow may cause water heater malfunctions. If this happens, please contact us via Emergency Support.
                        </div>`,
                        jp: `<p>右記の画像のように風呂場とキッチンの給湯器をどちらもオンにしてお使いください。</p>
                        <p>またお風呂場の優先ボタンを押したら、風呂場の給湯器が優先されキッチンから暖かいお湯が出ない場合がありますので、ご理解ください。</p>
                        <div class="tip-box fa-tip">
                            <strong>冬期の注意:</strong> 積雪による給湯器の故障する場合がありますので、その場合は緊急問い合わせよりご連絡ください。
                        </div>`
                    }
                },
                {
                    icon: "power",
                    title: { en: "Breaker Tripped", jp: "ブレーカー落ちた時どうすればいいでしょうか" },
                    content: {
                        en: `<p>The breaker panel is located as shown in the image.</p>
                        <p>Please check for any switches that are down (OFF) and flip them back up (ON).</p>`,
                        jp: `<p>右記の画像の場所にブレーカーがあります。</p>
                        <p>下がっているブレーカーのスイッチを元の位置（上）に戻してください。</p>`
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
                        en: `<p>For privacy reasons, we do not contact guests regarding lost items.</p>
                        <p>If you realize you left something behind, please contact us via your booking platform message or phone.</p>`,
                        jp: `<p>プライバシーの観点から、施設側から忘れ物のご連絡はいたしません。</p>
                        <p>お気づきの際は、ご予約いただいたOTAのメッセージまたは電話等でご連絡ください。</p>`
                    }
                },
                {
                    icon: "clock",
                    title: { en: "Early Check-in / Late Check-out", jp: "アーリーチェックインとレートチェックアウト" },
                    content: {
                        en: `<p>Available depending on reservation schedules.</p>
                        <p><strong>Fee:</strong> ¥10,000 per hour (includes cleaning fee adjustment).</p>
                        <p>Please contact us in advance to check availability.</p>`,
                        jp: `<p>前後の予約状況により可能です。</p>
                        <p><strong>追加料金:</strong> 1時間につき10,000円（清掃費含む）をいただいております。</p>
                        <p>ご希望の場合は事前にご連絡ください。</p>`
                    }
                }
            ]
        }
    ],
    services: [
        {
            id: 1,
            name: { en: "Jacuzzi", jp: "ジャグジー" },
            price: 10000,
            description: {
                en: "Excellent jacuzzi with lake view. *Available Mar-Nov only",
                jp: "湖を見ながら入るジャグジーは格別です。※3月~11月のみ利用可能"
            },
            image: "./img/jacuzzi.jpg",
            icon: "bath"
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
                <a href="#item-access-${index}" class="sidebar-subitem" onclick="scrollToId('item-access-${index}')">
                    ${icon} ${itemTitle}
                </a>
            `;
        });
    } else if (catId === 'services') {
        guidebookData.services.forEach(service => {
            const icon = ICONS[service.icon] || ICONS.amenities || '';
            html += `
                <a href="#service-${service.id}" class="sidebar-subitem" onclick="scrollToId('service-${service.id}')">
                    ${icon} ${getLocalizedText(service.name)}
                </a>
            `;
        });
    } else {
        // For Facilities, Rules, FAQ etc.
        const section = guidebookData.sections.find(s => s.id === catId);
        if (section && section.items) {
            section.items.forEach((item, index) => {
                const icon = ICONS[item.icon] || '';
                html += `
                    <button class="sidebar-subitem" style="background:none; border:none; width:100%; text-align:left; cursor:pointer;" onclick="scrollToId('item-${catId}-${index}')">
                        ${icon} ${getLocalizedText(item.title)}
                    </button>
                `;
            });
        }
    }

    sidebarList.innerHTML = html;
}

// Helper for smooth scrolling within the tab
window.scrollToId = function (id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Also open accordion if it is one
        if (el.classList.contains('accordion-item')) {
            el.classList.add('open');
        }
    }
}

window.scrollToElement = function (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderPropertyInfo() {
    const propertyNameEl = document.getElementById('property-name');
    const heroImage = document.querySelector('.hero-image');
    const welcomeMessageEl = document.getElementById('welcome-message');

    if (propertyNameEl) {
        propertyNameEl.textContent = guidebookData.propertyName;
    }
    if (heroImage && guidebookData.heroImage) {
        heroImage.src = guidebookData.heroImage;
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
            return `
                            <div class="content-card" id="item-${section.id}-${index}">
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
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    // Scroll to the specific item after a short delay (allow DOM to update)
    setTimeout(() => {
        const element = document.getElementById(itemId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
