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
    help: '<svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    rules: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
    check: '<svg class="icon-inline" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    phone: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    taxi: '<svg class="icon-inline" viewBox="0 0 24 24"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"></rect><path d="M7 11h.01M17 11h.01M7 20h10"></path><circle cx="7" cy="20" r="2"></circle><circle cx="17" cy="20" r="2"></circle></svg>',
    water: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>'
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
                    en: `<p>You can unlock the door using the Sesame Key installed at the entrance.<br>
                        We will send you a 4-digit PIN code via chat or email by the day of your check-in.<br><br>
                        After entering the PIN code, please press the 'Unlock' button on the bottom right to open the door.</p>
                        <div class="keybox-container">
                            <img src="img/mv_niseko/checkin_entrance.jpg" class="guidebook-img" style="height: 100%; object-fit: cover;" alt="Entrance">
                            <img src="img/mv_niseko/checkin_sesame_key.jpg" class="guidebook-img" style="height: 100%; object-fit: cover;" alt="Sesame Key">
                        </div>`,
                    jp: `<p>玄関に設置されているセサミキーで解錠が可能です。<br>
                        チェックイン当日までに、チャットまたはメールにて<br>
                        4桁の暗証番号をお送りします。<br><br>
                        暗証番号を入力後、右下の「解錠」ボタンを押して<br>
                        ドアを開けてください。</p>
                        <div class="keybox-container">
                            <img src="img/mv_niseko/checkin_entrance.jpg" class="guidebook-img" style="height: 100%; object-fit: cover;" alt="Entrance">
                            <img src="img/mv_niseko/checkin_sesame_key.jpg" class="guidebook-img" style="height: 100%; object-fit: cover;" alt="Sesame Key">
                        </div>`
                }
            },
            {
                icon: "wifi",
                title: { en: "WiFi", jp: "WiFi" },
                content: {
                    en: `<div class="wifi-container">
                            <div class="wifi-text">
                                <p><strong>Network Name:</strong> mvniseko<br>
                                <strong>Password:</strong> mountainv</p>
                            </div>
                            <div class="wifi-image">
                                <img src="img/mv_niseko/wifi_qr.png" alt="WiFi QR Code" class="guidebook-img">
                            </div>
                        </div>`,
                    jp: `<div class="wifi-container">
                            <div class="wifi-text">
                                <p><strong>ネットワーク名:</strong> mvniseko<br>
                                <strong>パスワード:</strong> mountainv</p>
                            </div>
                            <div class="wifi-image">
                                <img src="img/mv_niseko/wifi_qr.png" alt="WiFi QRコード" class="guidebook-img">
                            </div>
                        </div>`
                }
            },
            {
                icon: "address",
                title: { en: "Address", jp: "住所" },
                content: {
                    en: `<p>531-6 Fujimi, Kutchan-cho, Abuta-gun, Hokkaido 044-0075<br>
                        <a href="https://maps.app.goo.gl/e2tVrxN6MGjarwZJ8" target="_blank">📍 Open in Google Maps</a></p>`,
                    jp: `<p>〒044-0075<br>北海道虻田郡倶知安町富士見531-6<br>
                        <a href="https://maps.app.goo.gl/e2tVrxN6MGjarwZJ8" target="_blank">📍 Google Mapsで開く</a></p>`
                }
            },
            {
                icon: "parking",
                title: { en: "Parking", jp: "駐車場" },
                content: {
                    en: `<p>Parking is available on site.<br>Up to 3 cars can be parked.</p>
                        <p><img src="img/mv_niseko/parking.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Parking"></p>`,
                    jp: `<p>敷地内に駐車場がございます。<br>乗用車3台分を駐車できます。</p>
                        <p><img src="img/mv_niseko/parking.jpg" style="width:100%; border-radius:12px; margin-top:1rem;" alt="Parking"></p>`
                }
            },
            {
                icon: "car",
                title: { en: "From New Chitose Airport by Car", jp: "新千歳空港から車" },
                content: {
                    en: `<p>Approx. 1 hour 45 minutes by car from New Chitose Airport.<br>
                        There are several rental car companies around New Chitose Airport.<br>
                        Please check their information in advance according to your needs.</p>
                        <p>Go west on Route 478. Look for a black building with a slanted roof.</p>`,
                    jp: `<p>新千歳空港から車で約1時間45分。<br>
                        新千歳空港周辺には複数のレンタカー会社があります。<br>
                        ご利用の際は、ご希望に合わせて事前に各社の情報をご確認ください。</p>
                        <p>道道478号を西に進み、黒い建物で屋根が斜めになっている建物が目印です。</p>`
                }
            },
            {
                icon: "train",
                title: { en: "From New Chitose Airport by Train", jp: "新千歳空港から電車" },
                content: {
                    en: `<p>Take the JR Special Rapid Airport from New Chitose Airport to Otaru Station, then transfer to the JR Hakodate Main Line to Kutchan Station.</p>
                        <p><strong>Estimated travel time:</strong><br>Approx. 2 hours 45 minutes</p>`,
                    jp: `<p>JR特別快速エアポートで新千歳空港から小樽駅まで移動後、<br>
                        JR函館本線に乗り換え、小樽駅から倶知安駅までお越しください。</p>
                        <p><strong>所要時間の目安：</strong><br>約2時間45分</p>`
                }
            },
            {
                icon: "rentals",
                title: { en: "Transportation from Kutchan Station", jp: "倶知安駅からの移動" },
                content: {
                    en: `<p>There are no local buses around Kutchan Station.<br>
                        Please use a rental car or the taxi listed below to reach the accommodation.</p>
                        <p>Toyota Rent a Car Niseko Kutchan is a 5-minute walk from Kutchan Station.</p>
                        <p><a href="https://rent.toyota.co.jp/sp/shop/detail.aspx?rCode=61202&eCode=032" target="_blank" class="btn-login" style="display:inline-block; margin-top:0.5rem; text-decoration:none; color:white; border:1px solid white;">Details</a></p>`,
                    jp: `<p>倶知安駅周辺には路線バスがございません。<br>
                        そのため、レンタカーまたは下記のタクシーをご利用のうえ、<br>
                        宿泊施設までご移動ください。</p>
                        <p>トヨタレンタカー ニセコ倶知安店までは、<br>
                        倶知安駅から徒歩5分です。</p>
                        <p><a href="https://rent.toyota.co.jp/sp/shop/detail.aspx?rCode=61202&eCode=032" target="_blank" class="btn-login" style="display:inline-block; margin-top:0.5rem; text-decoration:none; color:white; border:1px solid white;">詳細はこちら</a></p>`
                }
            },
            {
                icon: "taxi",
                title: { en: "Taxi from Kutchan Station", jp: "倶知安駅からタクシー" },
                content: {
                    en: `<p><strong>IBS Limousine Niseko Office</strong><br>
                        TEL: 0136-55-8602</p>
                        <p><strong>World Kotsu Co., Ltd.</strong><br>
                        TEL: 0136-33-2114</p>
                        <p>The taxi app "GO" is available during the winter season (mid-December to mid-March)..<br>
                        If you plan to use a taxi, we recommend downloading the app in advance.</p>`,
                    jp: `<p><strong>（株）アイビーエスリムジン ニセコ営業所</strong><br>
                        TEL：0136-55-8602</p>
                        <p><strong>ワールド交通株式会社</strong><br>
                        TEL：0136-33-2114</p>
                        <p>毎年 12月中旬〜3月中旬 の冬季期間中は、配車アプリ「GO」をご利用いただけます。<br>
                        タクシーでの移動を予定されている方は、事前にアプリをダウンロードしておくことをおすすめします。</p>`
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
                    title: { en: "Shopping & Daily Necessities", jp: "買い物・生活用品" },
                    content: {
                        en: `<ul class="guide-list">
                            <li>
                                <strong>Seicomart Kutchan Takasago</strong> (4 min drive)<br>
                                <a href="https://maps.app.goo.gl/U5MsDrgaQFfs3w5p9" target="_blank">View Map</a>
                            </li>
                            <li>
                                <strong>Tsuruha Drug Kutchan Minami</strong> (5 min drive)<br>
                                <a href="https://maps.app.goo.gl/UFmHsAHdbNRMk7mj8" target="_blank">View Map</a>
                            </li>
                            <li>
                                <strong>MaxValu Kutchan</strong> (5 min drive)<br>
                                <a href="https://maps.app.goo.gl/hX8pHAyAKXf4FTk29" target="_blank">View Map</a>
                            </li>
                            <li>
                                <strong>Hokuren Kutchan Self SS / JA Yotei</strong> (5 min drive)<br>
                                <a href="https://maps.app.goo.gl/rWVgBkWJVYjGUSpy8" target="_blank">View Map</a>
                            </li>
                        </ul>`,
                        jp: `<ul class="guide-list">
                            <li>
                                <strong>セイコーマート倶知安高砂店</strong> (車で4分)<br>
                                <a href="https://maps.app.goo.gl/U5MsDrgaQFfs3w5p9" target="_blank">地図を見る</a>
                            </li>
                            <li>
                                <strong>ツルハドラッグ倶知安南店</strong> (車で5分)<br>
                                <a href="https://maps.app.goo.gl/UFmHsAHdbNRMk7mj8" target="_blank">地図を見る</a>
                            </li>
                            <li>
                                <strong>マックスバリュ倶知安店</strong> (車で5分)<br>
                                <a href="https://maps.app.goo.gl/hX8pHAyAKXf4FTk29" target="_blank">地図を見る</a>
                            </li>
                            <li>
                                <strong>ホクレン 倶知安セルフSS / JAようてい</strong> (車で5分)<br>
                                <a href="https://maps.app.goo.gl/rWVgBkWJVYjGUSpy8" target="_blank">地図を見る</a>
                            </li>
                        </ul>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Restaurants & Dining", jp: "レストラン・外食" },
                    content: {
                        en: `<h4 class="guide-sub-title">Sushi</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>Sushidokoro Nihonbashi</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 8 min)</div>
                                    <a href="https://maps.app.goo.gl/wfAaTVVrakbUkWWN7" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                                <li>
                                    <strong>Chiharu Zushi</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 8 min)</div>
                                    <a href="https://maps.app.goo.gl/qnkDXvDcgWpznoxy7" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                                <li>
                                    <strong>Kani Sushi Kato Setsu Niseko INORI</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 10 min)</div>
                                    <a href="https://maps.app.goo.gl/YKkgn4LoymeRDQoU8" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                            </ul>

                            <h4 class="guide-sub-title">Izakaya</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>Mondo Niseko</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 11 min)</div>
                                    <a href="https://maps.app.goo.gl/3rmg1Sh5va4vfpQK8" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                                <li>
                                    <strong>Sumibi Yakitori Tomarigi</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 5 min)</div>
                                    <a href="https://maps.app.goo.gl/Rq9CspKx8fQj8rH69" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                                <li>
                                    <strong>Marukyu Shoten</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 7 min)</div>
                                    <a href="https://maps.app.goo.gl/8uhjGXKeK16MS8D28" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                            </ul>

                            <div style="display: flex; flex-wrap: wrap; gap: 0 2rem;">
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">Italian</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>Okiraku Kitchen Boroya</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 9 min)</div>
                                            <a href="https://maps.app.goo.gl/8jJL6faEoMBuxRP86" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                        <li>
                                            <strong>Del Sole</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 25 min)</div>
                                            <a href="https://maps.app.goo.gl/TV4obGiE3gnYVDT9A" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                        <li>
                                            <strong>Niseko Takahashi Dairy Farm MANDRIANO</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 20 min)</div>
                                            <a href="https://maps.app.goo.gl/784KNCpGWit85f4e8" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                    </ul>
                                </div>
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">Set Meal Lunch</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>Te-zukuri Kitchen Narita</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 2 min)</div>
                                            <a href="https://maps.app.goo.gl/nZgrc1WUC4C62Ajy6" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                        <li>
                                            <strong>Sabo Nupuri</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 20 min)</div>
                                            <a href="https://maps.app.goo.gl/52SMajEM9yDQWebD6" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style="display: flex; flex-wrap: wrap; gap: 0 2rem;">
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">Chinese</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>Shokusai Chuka Xiexie</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 4 min)</div>
                                            <a href="https://maps.app.goo.gl/TDdTyb23CvnvkFV77" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                    </ul>
                                </div>
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">Motsunabe (Offal Hot Pot)</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>Utari</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 7 min)</div>
                                            <a href="https://maps.app.goo.gl/ZhC1NBkLDovUJxsx8" target="_blank" rel="noopener noreferrer">View Map</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <h4 class="guide-sub-title">Genghis Khan (BBQ)</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>Loft Club</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(By car: 22 min)</div>
                                    <a href="https://maps.app.goo.gl/G5UphhWd4bGJ74Fn9" target="_blank" rel="noopener noreferrer">View Map</a>
                                </li>
                            </ul>
                        `,
                        jp: `<h4 class="guide-sub-title">寿司</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>すし処日本橋</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/wfAaTVVrakbUkWWN7" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                                <li>
                                    <strong>千春鮨</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で8分)</div>
                                    <a href="https://maps.app.goo.gl/qnkDXvDcgWpznoxy7" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                                <li>
                                    <strong>蟹鮨加藤 雪ニセコ INORI</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で10分)</div>
                                    <a href="https://maps.app.goo.gl/YKkgn4LoymeRDQoU8" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                            </ul>

                            <h4 class="guide-sub-title">居酒屋</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>Mondo Niseko</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で11分)</div>
                                    <a href="https://maps.app.goo.gl/3rmg1Sh5va4vfpQK8" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                                <li>
                                    <strong>炭火焼きとり とまり木</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で5分)</div>
                                    <a href="https://maps.app.goo.gl/Rq9CspKx8fQj8rH69" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                                <li>
                                    <strong>マルキュー商店</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で7分)</div>
                                    <a href="https://maps.app.goo.gl/8uhjGXKeK16MS8D28" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                            </ul>

                            <div style="display: flex; flex-wrap: wrap; gap: 0 2rem;">
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">イタリアン</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>お気楽キッチン Boroya</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で9分)</div>
                                            <a href="https://maps.app.goo.gl/8jJL6faEoMBuxRP86" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                        <li>
                                            <strong>デルソーレ</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で25分)</div>
                                            <a href="https://maps.app.goo.gl/TV4obGiE3gnYVDT9A" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                        <li>
                                            <strong>ニセコ高橋牧場 MANDRIANO</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で20分)</div>
                                            <a href="https://maps.app.goo.gl/784KNCpGWit85f4e8" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                    </ul>
                                </div>
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">定食ランチ</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>手作りキッチン なり田</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で2分)</div>
                                            <a href="https://maps.app.goo.gl/nZgrc1WUC4C62Ajy6" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                        <li>
                                            <strong>茶房 ヌプリ</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で20分)</div>
                                            <a href="https://maps.app.goo.gl/52SMajEM9yDQWebD6" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style="display: flex; flex-wrap: wrap; gap: 0 2rem;">
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">中華</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>食彩中華シェイシェイ</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で4分)</div>
                                            <a href="https://maps.app.goo.gl/TDdTyb23CvnvkFV77" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                    </ul>
                                </div>
                                <div style="flex: 1; min-width: 300px;">
                                    <h4 class="guide-sub-title">もつ鍋</h4>
                                    <ul class="guide-list neighborhood-list">
                                        <li>
                                            <strong>うたり</strong>
                                            <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で7分)</div>
                                            <a href="https://maps.app.goo.gl/ZhC1NBkLDovUJxsx8" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <h4 class="guide-sub-title">ジンギスカン</h4>
                            <ul class="guide-list neighborhood-list two-col">
                                <li>
                                    <strong>Loft倶楽部</strong>
                                    <div style="margin-bottom: 0.5rem; font-size: 0.9em;">(車で22分)</div>
                                    <a href="https://maps.app.goo.gl/G5UphhWd4bGJ74Fn9" target="_blank" rel="noopener noreferrer">地図を見る</a>
                                </li>
                            </ul>
                        `,
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Hot Springs", jp: "温泉" },
                    content: {
                        en: `<div class="resort-list">
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>Kyogoku Onsen</strong> (10 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">Accessible and easy to drop by. Features an open-air bath where you can feel the nature of Mt. Yotei. Sauna, jacuzzi, and dining facilities are also available.<br>
                                    <strong>Note:</strong> Tattoos are NOT allowed.</p>
                                    <a href="https://maps.app.goo.gl/b1Qpo85qEdV2fhnQA" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>Kiranoyu</strong> (21 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">Modern and clean facility that is easy for everyone to use. It has a relaxing atmosphere suitable for long baths. Sauna is available.<br>
                                    <strong>Note:</strong> Tattoos are allowed.</p>
                                    <a href="https://maps.app.goo.gl/GmF2u9A36TRrMiai9" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>Yukoro Onsen</strong> (15 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">New hot spring facility opened in 2025. Modern building with a contemporary vibe. Equipped with indoor bath, outdoor bath, and sauna.<br>
                                    <strong>Note:</strong> Tattoos are allowed.</p>
                                    <a href="https://maps.app.goo.gl/Rr8PSjfiPaoV9Mh78" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>Niseko Prince Hotel Hirafutei</strong> (15 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">High-quality hot spring attached to a hotel. The open-air bath offers a good view and a calm atmosphere.<br>
                                    <strong>Note:</strong> Tattoos are NOT allowed.</p>
                                    <a href="https://maps.app.goo.gl/JbJ24jvZ2rUZyJmh6" target="_blank">View Map</a>
                                </div>
                            </details>
                        </div>`,
                        jp: `<div class="resort-list">
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>京極温泉 京極ふれあい交流センター</strong> (車で10分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">アクセスが良く、気軽に立ち寄れる温泉施設。羊蹄山の自然を感じられる露天風呂が魅力。サウナ、ジャグジー、食事処もあり設備が充実。<br>
                                    <strong>注意事項：</strong>タトゥー不可</p>
                                    <a href="https://maps.app.goo.gl/b1Qpo85qEdV2fhnQA" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>綺羅乃湯</strong> (車で21分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">モダンで清潔感があり、幅広い方に利用しやすい施設。ゆったりと長湯しやすい落ち着いた造り。サウナあり。<br>
                                    <strong>注意事項：</strong>タトゥー可</p>
                                    <a href="https://maps.app.goo.gl/GmF2u9A36TRrMiai9" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>ゆころ温泉</strong> (車で15分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">2025年オープンの新しい温泉施設。モダンな建物で今っぽい雰囲気。内湯、外湯、サウナ完備。<br>
                                    <strong>注意事項：</strong>タトゥー可</p>
                                    <a href="https://maps.app.goo.gl/Rr8PSjfiPaoV9Mh78" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="onsen-group">
                                <summary>
                                    <div><strong>ニセコプリンスホテル ひらふ亭</strong> (車で15分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">ホテル併設の上質な温泉。露天風呂からの景色が良く、落ち着いた雰囲気。<br>
                                    <strong>注意事項：</strong>タトゥー不可</p>
                                    <a href="https://maps.app.goo.gl/JbJ24jvZ2rUZyJmh6" target="_blank">地図を見る</a>
                                </div>
                            </details>
                        </div>`
                    }
                },
                {
                    icon: "sightseeing",
                    title: { en: "Ski Resorts", jp: "スキー場" },
                    content: {
                        en: `<div class="resort-list">
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>Niseko HANAZONO Resort</strong> (10 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">A modern ski resort with state-of-the-art facilities and enhanced parks. Brand new gondolas and facilities make it great for beginners to intermediates. Sophisticated restaurants and cafes are popular with international guests.</p>
                                    <a href="https://maps.app.goo.gl/9z6b5LmPKdBxgBL8A" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>Rusutsu Resort</strong> (30 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">One of Hokkaido's largest ski resorts with 3 connected mountains. Wide variety of courses from beginner to advanced. Popular with families and experts alike. A stay-type resort with amusement park and hotels.</p>
                                    <a href="https://maps.app.goo.gl/Xg8k3Fu6h81kJtk9" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>Niseko Annupuri International Ski Area</strong> (30 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">A ski resort with a relaxed, local atmosphere. Many gentle slopes, recommended for beginners and families. Ideal for those who want to ski leisurely without crowds.</p>
                                    <a href="https://maps.app.goo.gl/Px8TmKzJpv4bwJFj7" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>Niseko Village Ski Resort</strong> (25 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">Luxury resort directly connected to high-end hotels. Many long courses, highly satisfying for intermediate to advanced skiers. Equipped with gondolas for comfortable movement.</p>
                                    <a href="https://maps.app.goo.gl/8LqXQ5F7SMbae4Vj7" target="_blank">View Map</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>Kiroro Resort</strong> (45 min drive)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">Boasts some of the heaviest snowfall in Hokkaido with stable powder snow. Wide courses recommended for beginner to intermediate skiers. Calm atmosphere without being overly touristy.</p>
                                    <a href="https://maps.app.goo.gl/3LUvPjQNQ7C314BC6" target="_blank">View Map</a>
                                </div>
                            </details>
                        </div>`,
                        jp: `<div class="resort-list">
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>ニセコHANAZONOリゾート</strong> (車で10分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">最新設備とパークが充実したモダンなスキーリゾート。ゴンドラや施設が新しく、初心者〜中級者におすすめ。レストランやカフェも洗練されており、海外ゲストに人気。</p>
                                    <a href="https://maps.app.goo.gl/9z6b5LmPKdBxgBL8A" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>ルスツリゾートスキー場</strong> (車で30分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">北海道最大級、3つの山が連結した大型スキーリゾート。初級〜上級まで幅広く対応し、ファミリーにも上級者にも人気。遊園地やホテルも併設された滞在型リゾート。</p>
                                    <a href="https://maps.app.goo.gl/Xg8k3Fu6h81kJtk9" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>ニセコアンヌプリ国際スキー場</strong> (車で30分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">落ち着いた雰囲気のローカル感あるスキー場。緩斜面が多く、初心者やファミリーにおすすめ。混雑しにくく、のんびり滑りたい方に最適。</p>
                                    <a href="https://maps.app.goo.gl/Px8TmKzJpv4bwJFj7" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>ニセコビレッジスキーリゾート</strong> (車で25分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">高級ホテル直結のラグジュアリーリゾート。ロングコースが多く、中〜上級者にも満足度が高い。ゴンドラ完備でゲレンデ移動が快適。</p>
                                    <a href="https://maps.app.goo.gl/8LqXQ5F7SMbae4Vj7" target="_blank">地図を見る</a>
                                </div>
                            </details>
                            <details class="living-accordion" name="ski-resort-group">
                                <summary>
                                    <div><strong>キロロリゾート</strong> (車で45分)</div>
                                </summary>
                                <div class="accordion-body">
                                    <p class="resort-desc">北海道屈指の降雪量で、安定したパウダースノー。コース幅が広く、初心者〜中級者におすすめ。観光地化しすぎておらず、落ち着いた雰囲気。</p>
                                    <a href="https://maps.app.goo.gl/3LUvPjQNQ7C314BC6" target="_blank">地図を見る</a>
                                </div>
                            </details>
                        </div>`
                    }
                },


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
                            <p>チェックイン30日前までのキャンセル、またはチェックイン7日前までの予約で、予約確定後24時間以内のキャンセル。</p>
                            <h4 class="guide-sub-title">50%返金</h4>
                            <p>チェックイン30日前までのキャンセルで、予約確定後24時間を過ぎた場合。</p>
                            <h4 class="guide-sub-title">全額返金</h4>
                            <p>チェックイン30日を切ってからのキャンセルだが、チェックイン7日前までの予約で、予約確定後24時間以内のキャンセル。</p>
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
                            <p>Smoking is prohibited inside the building. Please use the terrace if you smoke. No ashtrays are provided. Fines may be imposed if smoking is discovered.</p>
                            <h4 class="guide-sub-title">Damages</h4>
                            <p>If items or facilities are damaged or soiled, please be sure to contact us regardless of whether it was intentional or accidental. We may charge you based on the terms of use.</p>
                            <p style="margin-top: 1rem; font-size: 0.9em; color: #ccc;">* Violations of rules may result in termination of stay. Package delivery/receipt is not allowed.</p>`,
                        jp: `<h4 class="guide-sub-title">騒音</h4>
                            <p>大声で騒ぐ・音楽を大音量で流すなど、近隣のご迷惑になる行為はご遠慮ください。入口周辺でのたむろ行為は周辺住民のご迷惑となります。近隣から指摘があった場合、利用を中止いただくことがあります。</p>
                            <h4 class="guide-sub-title">喫煙</h4>
                            <p>建物内は禁煙です。喫煙される場合はテラスをご利用ください。灰皿の用意はありません。喫煙が発覚した場合、罰金を課す場合があります。</p>
                            <h4 class="guide-sub-title">破損・汚損があった際の対応</h4>
                            <p>備品や設備を破損・汚損された場合、故意または過失を問わず必ずご連絡ください。利用規約に基づき、ご請求をさせていただく場合があります。</p>
                            <p style="margin-top: 1rem; font-size: 0.9em; color: #ccc;">※その他、利用規約に反した行為が確認された場合は、利用を中止させていただくことがあります。予約時間前後の荷物の受取・配達はできません。</p>`
                    }
                },
                {
                    icon: "cancel",
                    title: { en: "Prohibited Acts", jp: "禁止行為" },
                    content: {
                        en: `<h4 class="guide-sub-title">Unauthorized Extension</h4>
                            <p>Please adhere to check-in/out times. ¥8,000 per 30 min charged for unauthorized extensions.</p>
                            <h4 class="guide-sub-title">Use of Fire</h4>
                            <p>Use of fire indoors is prohibited (except kitchen stove).</p>`,
                        jp: `<h4 class="guide-sub-title">無断延長</h4>
                            <p>予約時間内での入退室をお願いします。無断延長は30分につき8,000円を請求します。</p>
                            <h4 class="guide-sub-title">火気の利用</h4>
                            <p>室内での火気利用は禁止です（キッチンコンロを除く）。</p>`
                    }
                },
                {
                    icon: "info",
                    title: { en: "Important Notes", jp: "注意事項" },
                    content: {
                        en: `<ul class="guide-list">
                                <li>① Do not take items home. Authorized removal may be charged.</li>
                                <li>② No shoes indoors.</li>
                                <li>③ Be mindful of noise when windows/door are open.</li>
                                <li>④ No security cameras. Manage valuables yourself.</li>
                            </ul>`,
                        jp: `<ul class="guide-list">
                                <li>① 備品は持ち帰らないでください。無断持ち出しは請求対象となる場合があります。</li>
                                <li>② 靴で室内には入らないでください。</li>
                                <li>③ 窓・玄関を開放しての騒音にはご注意ください。</li>
                                <li>④ 防犯カメラは設置していません。貴重品の管理はご利用者様で行ってください。</li>
                            </ul>`
                    }
                },
                {
                    icon: "money",
                    title: { en: "Pricing", jp: "料金体系" },
                    content: {
                        en: `<h4 class="guide-sub-title">Capacity</h4>
                            <p>Max 6 guests (Adults + Children).</p>
                            <h4 class="guide-sub-title">Extra Charge</h4>
                            <p>¥5,000 per person for 4+ guests.</p>
                            <h4 class="guide-sub-title">Infants</h4>
                            <p>Counted as 1 guest from age 0.</p>`,
                        jp: `<h4 class="guide-sub-title">定員</h4>
                            <p>大人・子供合わせて6名まで。</p>
                            <h4 class="guide-sub-title">追加料金</h4>
                            <p>4名以上の場合、1名につき5,000円がかかります。</p>
                            <h4 class="guide-sub-title">乳幼児</h4>
                            <p>0歳児から1名としてカウントします。</p>`
                    }
                },
                {
                    icon: "check",
                    title: { en: "Checkout Checklist", jp: "退出時チェックリスト" },
                    content: {
                        en: `<ul class="guide-list">
                                <li>① Reset furniture/items to original layout.</li>
                                <li>② Sort trash.</li>
                                <li>③ Empty fridge (take all food home).</li>
                                <li>④ Turn off AC and lights.</li>
                                <li>⑤ Check for belongings (cables, fridge, umbrella, etc.).</li>
                                <li>⑥ Report any lost or broken items.</li>
                            </ul>`,
                        jp: `<ul class="guide-list">
                                <li>① 机・椅子・小物を動かした場合は元のレイアウトに戻してください</li>
                                <li>② ゴミは分別して置いてください</li>
                                <li>③ 残った食材は冷蔵庫に残さず、すべてお持ち帰りください</li>
                                <li>④ エアコン・電気などの電源をオフにしてください</li>
                                <li>⑤ 忘れ物はありませんか？（充電ケーブル／冷蔵庫内／傘／衣類など）</li>
                                <li>⑥ 備品の紛失・破損があった場合はご連絡ください</li>
                            </ul>`
                    }
                },
                {
                    icon: "info",
                    title: { en: "Snow Removal", jp: "除雪" },
                    content: {
                        en: `<p>During winter, town snow plows operate generally between 3:00 AM and 7:00 AM. Schedules may vary based on weather. Please exercise caution. Private property may be excluded.</p>`,
                        jp: `<p>冬季期間中は、町の自治体による除雪車が街全体を対象に除雪作業を行います。除雪は毎日、午前3時〜7時頃の時間帯に実施されるのが一般的です。</p>
                            <p>天候や降雪量により、作業時間や順序が前後する場合があります。また、除雪後も時間帯によっては再度積雪することがありますので、外出時や運転の際は十分ご注意ください。</p>
                            <p style="font-size: 0.9em; color: #ccc;">※敷地内や私有スペースは、自治体の除雪対象外となる場合があります。</p>`
                    }
                },
                {
                    icon: "trash",
                    title: { en: "Trash", jp: "ゴミ" },
                    content: {
                        en: `<p>Bins are in the kitchen. Please sort:</p>
                            <ul class="guide-list">
                                <li>- Combustible</li>
                                <li>- Cans, Bottles, PET</li>
                            </ul>`,
                        jp: `<p>ゴミ箱はキッチンに設置しています。分別にご協力をお願いいたします。</p>
                            <ul class="guide-list">
                                <li>・可燃ゴミ</li>
                                <li>・ペットボトル・缶・びん</li>
                            </ul>`
                    }
                },
                {
                    icon: "phone",
                    title: { en: "Emergency Contact", jp: "緊急時連絡先" },
                    content: {
                        en: `<p><strong>Manager (Matsumoto):</strong> 070-8487-6820</p>`,
                        jp: `<p><strong>管理者 (松本):</strong> 070-8487-6820</p>`
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
                    title: { en: "Change Guest Count", jp: "宿泊人数変更したいです。" },
                    collapsible: true,
                    content: {
                        en: `<p><strong>For OTA bookings:</strong> Please contact each OTA platform directly.</p>
                            <p><strong>For official site bookings:</strong> Please contact us via chat or the email address used for booking.</p>`,
                        jp: `<p><strong>OTAからご予約の場合:</strong> 各OTAにお問い合わせください。</p>
                            <p><strong>公式サイトからのご予約の場合:</strong> チャットまたはご予約いただいたメールアドレスからお問い合わせください。</p>`
                    }
                },
                {
                    icon: "luggage",
                    title: { en: "Luggage Delivery (Pre/Post)", jp: "事前・事後に荷物を配送したい場合" },
                    collapsible: true,
                    content: {
                        en: `<p>You may send luggage in advance as long as the delivery is scheduled after 12:00 PM on the day of your check-in. Please note that this is an unmanned facility and we cannot receive packages in person; they will be left at the entrance.</p>
                            <p style="font-size: 0.9em; color: #ccc;">* Packages will be left at the entrance (unlocked area). We cannot be held responsible for any loss, so please do not send valuables.</p>
                            <p><strong>Address:</strong><br>
                            〒044-0075<br>
                            531-6 Fujimi, Kutchan-cho, Abuta-gun, Hokkaido</p>
                            <p><strong>Recipient:</strong><br>
                            Please include your check-in date and reservation name.</p>`,
                        jp: `<p>ご宿泊日の当日12時以降の到着指定であれば、事前に送って頂いても大丈夫です。当施設は無人営業でお受け取りできないため、置き配になります。</p>
                            <p style="font-size: 0.9em; color: #ccc;">※お荷物は玄関(施錠されていない場所)に届きますので、紛失の責任は負いかねます。貴重品類配送はお控えくださいませ。</p>
                            <p><strong>送付先：</strong><br>
                            〒044-0075<br>
                            北海道虻田郡倶知安町富士見５３１−６</p>
                            <p><strong>宛名：</strong><br>
                            宿泊日/ご予約名の記載をお願いいたします。</p>`
                    }
                },
                {
                    icon: "help",
                    title: { en: "What if it's cold?", jp: "寒い時どうすればいいですか？" },
                    collapsible: true,
                    content: {
                        en: `<p>The room is equipped with air conditioning and panel heaters.</p>
                            <p>If you feel cold, please check that the air conditioner is set to heating mode and the panel heater is turned on. Using both together will help keep the room comfortably warm.</p>`,
                        jp: `<p>室内にはエアコンおよびパネルヒーターを設置しております。</p>
                            <p>寒さを感じる場合は、エアコンの暖房設定とあわせて、パネルヒーターの電源が入っているかをご確認ください。併用していただくことで、より暖かくお過ごしいただけます。</p>`
                    }
                },
                {
                    icon: "water",
                    title: { en: "Where is the water heater switch?", jp: "給湯器のスイッチはどこですか？" },
                    collapsible: true,
                    content: {
                        en: `<p>The water heater switch is located inside the building.</p>
                            <p>Please note there are some parts that should not be touched; please check the guide images for details. Only if it is accidentally turned off, please check the designated switch and turn it back ON.</p>
                            <details class="living-accordion" style="margin-top: 1rem;">
                                <summary>View Image</summary>
                                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                                    <img src="img/water_heater_1.png" alt="Water Heater 1" class="living-image" style="width: 100%; max-width: 300px; border-radius: 8px;">
                                    <img src="img/water_heater_2.png" alt="Water Heater 2" class="living-image" style="width: 100%; max-width: 300px; border-radius: 8px;">
                                </div>
                            </details>`,
                        jp: `<p>給湯器のスイッチは館内に設置されています。</p>
                            <p>触ってはいけない箇所がありますので、案内用の画像をご確認ください。万が一オフになっている場合のみ、指定されたスイッチをご確認の上、ONにしてください。</p>
                            <details class="living-accordion" style="margin-top: 1rem;">
                                <summary>画像を表示</summary>
                                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                                    <img src="img/water_heater_1.png" alt="給湯器1" class="living-image" style="width: 100%; max-width: 300px; border-radius: 8px;">
                                    <img src="img/water_heater_2.png" alt="給湯器2" class="living-image" style="width: 100%; max-width: 300px; border-radius: 8px;">
                                </div>
                            </details>`
                    }
                },
                {
                    icon: "power",
                    title: { en: "Power Outage / Breaker", jp: "電気が切れたんだけど、どうすればいいですか？" },
                    collapsible: true,
                    content: {
                        en: `<p>If the power suddenly goes out, a breaker may have tripped. Please follow these steps to restore power:</p>
                            <p>① Go to the changing room (the room before the bathroom) and push the tripped breaker in the upper right down once.</p>
                            <details class="living-accordion" style="margin-bottom: 1rem;">
                                <summary>View Image</summary>
                                <img src="img/lakesideinn/breaker_step_2.jpg" alt="Step 1" class="living-image" loading="lazy" style="width: 100%; max-width: 400px; display: block; margin: 1rem auto 0; border-radius: 8px;">
                            </details>
                            <p>② Then push it all the way up to "ON". 👉 It should click into place.</p>
                            <details class="living-accordion">
                                <summary>View Image</summary>
                                <img src="img/lakesideinn/breaker_step_1.jpg" alt="Step 2" class="living-image" loading="lazy" style="width: 100%; max-width: 400px; display: block; margin: 1rem auto 0; border-radius: 8px;">
                            </details>`,
                        jp: `<p>電気が突然使えなくなった場合、ブレーカーが落ちている可能性があります。以下の手順で復旧してください。</p>
                            <p>① 脱衣所(浴室の手前の部屋)に入り、右上のブレーカーのうち、落ちているものを一度いちばん下まで下げてください。</p>
                            <details class="living-accordion" style="margin-bottom: 1rem;">
                                <summary>画像を表示</summary>
                                <img src="img/lakesideinn/breaker_step_2.jpg" alt="手順1" class="living-image" loading="lazy" style="width: 100%; max-width: 400px; display: block; margin: 1rem auto 0; border-radius: 8px;">
                            </details>
                            <p>② その後、しっかり上まで上げて「ON」にしてください。👉 カチッと音がすればOKです。</p>
                            <details class="living-accordion">
                                <summary>画像を表示</summary>
                                <img src="img/lakesideinn/breaker_step_1.jpg" alt="手順2" class="living-image" loading="lazy" style="width: 100%; max-width: 400px; display: block; margin: 1rem auto 0; border-radius: 8px;">
                            </details>`
                    }
                },
                {
                    icon: "taxi",
                    title: { en: "Transportation other than car", jp: "車以外の移動手段はありますか？" },
                    collapsible: true,
                    content: {
                        en: `<p>During the winter season, the ride-hailing app "GO" is available. If you plan to use a taxi, we recommend downloading the app in advance.</p>`,
                        jp: `<p>冬季期間中は配車アプリ「GO」が使用できます。タクシー利用予定の方は、事前にアプリをダウンロードしておくことをおすすめします。</p>`
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
        html += `<button class="sidebar-subitem" style="background:none; border:none; width:100%; text-align:left; cursor:pointer;" onclick="scrollToId('item-${catId}-${index}', event)">
            ${ICONS[item.icon] || ''} ${getLocalizedText(item.title)}
        </button>`;
    });

    // If we want to keep being able to switch categories from sidebar, the sidebar should contain main categories too.
    // In Lake House, it seems the sidebar is used for sub-navigation.
    nav.innerHTML = html;
}

function renderSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;

    let html = '';
    const lang = getLang();
    // Helper to get text (though not strictly used below for structure, kept for consistency if needed)
    const t = window.translations ? window.translations[lang] : {};

    // Render Access section first (now as expanded cards)
    if (guidebookData.access && guidebookData.access.items) {
        const accessTitle = getLocalizedText(guidebookData.access.title);
        // Note: Using id="section-access" to match MV's switchCategory logic, 
        // whereas Lake House uses id="access". Kept section-access for compatibility.
        html += `
            <section class="guidebook-section" id="section-access">
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
    // Render expanded card sections
    guidebookData.sections.forEach(section => {
        const sectionTitle = getLocalizedText(section.title) || section.title;

        let itemsHtml = '';
        if (section.id === 'faq') {
            // Render ONLY the first item: "Change Guest Count" - 1:1 Lake House Structure
            // Using index 0
            if (section.items.length > 0) {
                const item = section.items[0];
                const itemTitle = getLocalizedText(item.title) || item.title;
                const itemContent = getLocalizedText(item.content) || item.content;
                const iconHtml = item.icon && ICONS[item.icon] ? ICONS[item.icon] : '';

                itemsHtml = `
                     <details class="content-card living-accordion" id="item-faq-0" open>
                         <summary class="card-header" style="justify-content: space-between;">${iconHtml} ${itemTitle}</summary>
                         <div class="card-body">
                             ${itemContent}
                         </div>
                     </details>
                 `;
            }
        } else {
            // Standard rendering for other sections
            itemsHtml = section.items.map((item, index) => {
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
            }).join('');
        }

        html += `
            <section class="guidebook-section dynamic-section" id="section-${section.id}">
                <h2 class="section-title">${sectionTitle}</h2>
                <div class="content-cards">
                    ${itemsHtml}
                </div>
            </section>
        `;
    });

    container.innerHTML = html;
}

window.scrollToId = function (id, event) {
    if (event) event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Open details if it's a collapsible card
    if (el.tagName === 'DETAILS') {
        el.open = true;
    }

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
