/**
 * Guest Guidebook - JavaScript
 * Handles accordion functionality, navigation, and data rendering
 * Supports bilingual content (EN/JP)
 */

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
    fire: '<svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 22c-4.97 0-9-4.03-9-9 0-4 4-8 4-12 0 0 3 2 4 6 1.5-2 2-4 2-4s3 2.5 3 6c2-1 3-2.5 3-2.5s2 3.5 2 6.5c0 4.97-4.03 9-9 9z"></path></svg>'
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
        title: { en: "Access", jp: "アクセス" },
        items: [
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
                    en: `<p>Parking for 3 cars is available. Please refer to the image.</p>
                        <img src="./img/parking_layout.jpg" alt="Parking Layout" class="access-image">`,
                    jp: `<p>乗用車3台分を駐車できます。画像をご参照ください。</p>
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
                        <p>長野駅でレンタカーを借りることも可能</p>`
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
                title: { en: "Taxi Companies", jp: "タクシー会社" },
                content: {
                    en: `<p><strong>Nojiriko Taxi:</strong> 026-219-2829</p>
                        <p><strong>Toriigawa Kanko Taxi:</strong> 026-255-3155</p>`,
                    jp: `<p><strong>野尻湖タクシー（株）:</strong> 026−219−2829</p>
                        <p><strong>鳥居川観光タクシー（株）:</strong> 026−255−3155</p>`
                }
            }
        ]
    },

    // Main Guide Sections
    sections: [
        {
            id: "facility",
            title: { en: "Facilities", jp: "施設" },
            items: [
                {
                    icon: "checkin",
                    title: { en: "Check-in Guide", jp: "チェックイン方法" },
                    content: {
                        en: `<p>Upon arrival, locate the key lockbox on the right side of the entrance. Enter your 4-digit code to retrieve the keys.</p>
                        <p>Please remove shoes at the genkan (entrance area) and use the provided slippers inside.</p>`,
                        jp: `<p>到着後、玄関右側のキーボックスを探してください。4桁のコードを入力して鍵を取り出してください。</p>
                        <p>玄関で靴を脱ぎ、室内用スリッパをご使用ください。</p>`
                    }
                },
                {
                    icon: "water",
                    title: { en: "Water Heater", jp: "給湯器の案内" },
                    content: {
                        en: `<p>The water heater is located in the utility room. It is set to automatic mode and should provide hot water immediately.</p>
                        <p>Floor heating controls are on the wall panel near the living room.</p>`,
                        jp: `<p>給湯器はユーティリティルームにあります。自動モードに設定されており、すぐにお湯が出ます。</p>
                        <p>床暖房のコントロールパネルはリビング近くの壁にあります。</p>`
                    }
                },
                {
                    icon: "amenities",
                    title: { en: "Amenities", jp: "アメニティの案内" },
                    content: {
                        en: `<p>We provide the following amenities:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>Shampoo, conditioner, body wash</li>
                            <li>Towels (bath and face)</li>
                            <li>Hair dryer</li>
                            <li>Toothbrush sets</li>
                            <li>Slippers</li>
                        </ul>`,
                        jp: `<p>以下のアメニティをご用意しています:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>シャンプー・コンディショナー・ボディソープ</li>
                            <li>タオル（バス・フェイス）</li>
                            <li>ドライヤー</li>
                            <li>歯ブラシセット</li>
                            <li>スリッパ</li>
                        </ul>`
                    }
                },
                {
                    icon: "kitchen",
                    title: { en: "Kitchen Tools", jp: "調理器具の使用方法" },
                    content: {
                        en: `<p>The kitchen is fully equipped with:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>Refrigerator & freezer</li>
                            <li>Induction cooktop (3 burners)</li>
                            <li>Microwave oven</li>
                            <li>Rice cooker</li>
                            <li>Pots, pans, cooking utensils</li>
                            <li>Plates, bowls, cups, cutlery</li>
                            <li>Plates, bowls, cups, cutlery</li>
                        </ul>`,
                        jp: `<p>キッチンには以下の設備があります:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>冷蔵庫・冷凍庫</li>
                            <li>IHコンロ（3口）</li>
                            <li>電子レンジ</li>
                            <li>炊飯器</li>
                            <li>鍋・フライパン・調理器具</li>
                            <li>食器類</li>
                        </ul>`
                    }
                },
                {
                    icon: "bath",
                    title: { en: "Bath Usage", jp: "浴室の使用方法" },
                    content: {
                        en: `<p>The bathroom features a traditional Japanese soaking tub. Please rinse off before entering the tub.</p>
                        <p>Hot water is available 24/7. Temperature can be adjusted using the control panel.</p>`,
                        jp: `<p>浴室には日本式の浴槽があります。湯船に入る前に体を洗ってください。</p>
                        <p>お湯は24時間使用可能です。温度はコントロールパネルで調整できます。</p>`
                    }
                },
                {
                    icon: "dishes",
                    title: { en: "Dishes", jp: "食器類の説明" },
                    content: {
                        en: `<p>Dish soap and sponges are provided under the kitchen sink. Please wash and dry dishes before checkout.</p>
                        <p>A dishwasher is available - detergent pods are in the cabinet above.</p>`,
                        jp: `<p>食器用洗剤とスポンジはシンク下にあります。チェックアウト前に食器を洗って乾かしてください。</p>
                        <p>食洗機もあります。洗剤は上の棚にあります。</p>`
                    }
                },
                {
                    icon: "condiments",
                    title: { en: "Condiments", jp: "調味料の説明" },
                    content: {
                        en: `<p>We provide basic condiments:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>Salt, pepper, cooking oil</li>
                            <li>Soy sauce</li>
                            <li>Coffee, tea</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">Feel free to use these during your stay.</p>`,
                        jp: `<p>基本的な調味料をご用意しています:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>塩・胡椒・油</li>
                            <li>醤油</li>
                            <li>コーヒー・紅茶</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">ご自由にお使いください。</p>`
                    }
                },
                {
                    icon: "rentals",
                    title: { en: "Rental Items", jp: "貸出品の使い方" },
                    content: {
                        en: `<p>The following items are available for rent:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>SUP boards</li>
                            <li>BBQ grill set</li>
                            <li>Fishing equipment</li>
                            <li>Bicycles</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">See Optional Services section below for pricing.</p>`,
                        jp: `<p>以下のアイテムがレンタル可能です:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li>SUPボード</li>
                            <li>BBQグリルセット</li>
                            <li>釣り道具</li>
                            <li>自転車</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">料金は下のオプションサービスをご覧ください。</p>`
                    }
                },
                {
                    icon: "ac",
                    title: { en: "Air Conditioning", jp: "エアコンの使い方" },
                    content: {
                        en: `<p>Each room has its own air conditioning unit. Remotes are located on the wall mount or bedside table.</p>
                        <p>Please turn off A/C when leaving the property to conserve energy.</p>`,
                        jp: `<p>各部屋にエアコンがあります。リモコンは壁掛けまたはベッドサイドにあります。</p>
                        <p>外出時はエアコンをオフにしてください。</p>`
                    }
                },
                {
                    icon: "wifi",
                    title: { en: "WiFi", jp: "WiFiの紹介" },
                    content: {
                        en: `<p><strong>Network Name:</strong> LAKEHOUSE_GUEST</p>
                        <p><strong>Password:</strong> nojiriko2024</p>
                        <p>Speed: Up to 100Mbps. Router is located in the living room.</p>`,
                        jp: `<p><strong>ネットワーク名:</strong> LAKEHOUSE_GUEST</p>
                        <p><strong>パスワード:</strong> nojiriko2024</p>
                        <p>速度: 最大100Mbps。ルーターはリビングにあります。</p>`
                    }
                },
                {
                    icon: "rooms",
                    title: { en: "Rooms", jp: "各部屋の紹介" },
                    content: {
                        en: `<p><strong>1F:</strong> Living room, dining area, kitchen, bathroom, toilet</p>
                        <p><strong>2F:</strong> 3 bedrooms (2 queen, 1 twin), toilet</p>
                        <p>Maximum occupancy: 8 guests</p>`,
                        jp: `<p><strong>1F:</strong> リビング・ダイニング・キッチン・浴室・トイレ</p>
                        <p><strong>2F:</strong> 寝室3部屋（クイーン2・ツイン1）・トイレ</p>
                        <p>最大定員: 8名</p>`
                    }
                },
                {
                    icon: "trash",
                    title: { en: "Trash Disposal", jp: "ゴミの捨て方" },
                    content: {
                        en: `<p>Please separate trash:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li><strong>Burnable:</strong> Food waste, paper</li>
                            <li><strong>Plastic:</strong> Bottles, packaging</li>
                            <li><strong>PET Bottles:</strong> Remove caps</li>
                            <li><strong>Cans/Glass:</strong> Rinse before disposal</li>
                            <li><strong>Cans/Glass:</strong> Rinse before disposal</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">Please take all trash with you upon checkout.</p>`,
                        jp: `<p>ゴミは分別してください:</p>
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            <li><strong>可燃:</strong> 生ゴミ・紙</li>
                            <li><strong>プラ:</strong> ボトル・包装</li>
                            <li><strong>ペットボトル:</strong> キャップを外す</li>
                            <li><strong>缶・瓶:</strong> 洗ってから</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">チェックアウト時にゴミはお持ち帰りください。</p>`
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
                    title: { en: "Daily Goods & Grocery", jp: "生活雑貨" },
                    content: {
                        en: `<p><strong>Tsuruya:</strong> 10 min drive - Large supermarket with local produce</p>
                        <p><strong>7-Eleven:</strong> 5 min drive - 24 hours</p>
                        <p><strong>Lawson:</strong> 7 min drive - 24 hours</p>
                        <p>We recommend stocking up before arriving, especially in the evening.</p>`,
                        jp: `<p><strong>スーパーツルヤ:</strong> 車10分・地元の食材が揃う大型スーパー</p>
                        <p><strong>セブンイレブン:</strong> 車5分・24時間営業</p>
                        <p><strong>ローソン:</strong> 車7分・24時間営業</p>
                        <p>特に夜到着の場合は事前に買い物をおすすめします。</p>`
                    }
                },
                {
                    icon: "sightseeing",
                    title: { en: "Sightseeing", jp: "観光スポット" },
                    content: {
                        en: `<p><strong>Lake Nojiri:</strong> 2 min walk - Beautiful lake with water activities</p>
                        <p><strong>Togakushi Shrine:</strong> 30 min drive - Ancient shrine in cedar forest</p>
                        <p><strong>Zenko-ji Temple:</strong> 45 min drive - National treasure, must-visit</p>
                        <p><strong>Ski Resorts:</strong> 20-40 min drive (winter)</p>`,
                        jp: `<p><strong>野尻湖:</strong> 徒歩2分・ウォーターアクティビティ</p>
                        <p><strong>戸隠神社:</strong> 車30分・杉林の中の古社</p>
                        <p><strong>善光寺:</strong> 車45分・国宝・必見</p>
                        <p><strong>スキー場:</strong> 車20-40分（冬季）</p>`
                    }
                },
                {
                    icon: "restaurant",
                    title: { en: "Restaurants", jp: "レストラン" },
                    content: {
                        en: `<p><strong>Soba Takagi:</strong> 15 min drive - Famous handmade soba</p>
                        <p><strong>Lamp Bistro:</strong> 10 min drive - Western cuisine with local ingredients</p>
                        <p><strong>Yakiniku Matsumoto:</strong> 20 min drive - Quality Japanese BBQ</p>
                        <p>Many restaurants close early (around 8 PM). Reservations recommended on weekends.</p>`,
                        jp: `<p><strong>蕎麦たかぎ:</strong> 車15分・手打ち蕎麦</p>
                        <p><strong>ランプビストロ:</strong> 車10分・地元食材の洋食</p>
                        <p><strong>焼肉松本:</strong> 車20分・焼肉</p>
                        <p>多くの店は20時頃に閉まります。週末は予約をおすすめします。</p>`
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
                        en: `<p><strong>30+ days before:</strong> Full refund</p>
                        <p><strong>14-29 days before:</strong> 50% refund</p>
                        <p><strong>7-13 days before:</strong> 25% refund</p>
                        <p><strong>Less than 7 days:</strong> No refund</p>`,
                        jp: `<p><strong>30日以上前:</strong> 全額返金</p>
                        <p><strong>14-29日前:</strong> 50%返金</p>
                        <p><strong>7-13日前:</strong> 25%返金</p>
                        <p><strong>7日未満:</strong> 返金不可</p>`
                    }
                },
                {
                    icon: "smoke",
                    title: { en: "Smoking Policy", jp: "禁煙喫煙" },
                    content: {
                        en: `<p><strong>Strictly No Smoking Indoors</strong></p>
                        <p>A designated outdoor smoking area is available on the deck.</p>
                        <p>Please use the provided ashtray.</p>
                        <p>A ¥50,000 cleaning fee will be charged if indoor smoking is detected.</p>`,
                        jp: `<p><strong>室内禁煙</strong></p>
                        <p>デッキに喫煙スペースがあります。</p>
                        <p>備え付けの灰皿をお使いください。</p>
                        <p>室内喫煙が発覚した場合、5万円の清掃費を請求します。</p>`
                    }
                },
                {
                    icon: "noise",
                    title: { en: "Noise", jp: "騒音の注意" },
                    content: {
                        en: `<p>Please keep noise to a minimum, especially after 10:00 PM.</p>
                        <p>This is a residential area with neighbors nearby.</p>
                        <p>Loud music or parties are not permitted.</p>`,
                        jp: `<p>22時以降は特に静かにお過ごしください。</p>
                        <p>周辺は住宅地です。</p>
                        <p>大音量の音楽やパーティーはご遠慮ください。</p>`
                    }
                },
                {
                    icon: "damage",
                    title: { en: "Damages", jp: "備品が壊れた際の注意点" },
                    content: {
                        en: `<p>Please report any damages or broken items immediately to the host.</p>
                        <p>Accidents happen - we appreciate honesty. Repair costs will be assessed fairly.</p>`,
                        jp: `<p>破損があった場合は、すぐにホストにご連絡ください。</p>
                        <p>事故は起こりうるものです。正直にお伝えいただければ、修理費は公正に査定いたします。</p>`
                    }
                },
                {
                    icon: "damage",
                    title: { en: "Stains & Cleaning", jp: "汚した際の注意点" },
                    content: {
                        en: `<p>Please take care with food and drinks on furniture and bedding.</p>
                        <p>Cleaning supplies are available under the kitchen sink for minor spills.</p>
                        <p>Additional cleaning fees may apply for excessive mess.</p>`,
                        jp: `<p>家具や寝具への飲食物の汚れにご注意ください。</p>
                        <p>軽い汚れ用の清掃用品はシンク下にあります。</p>
                        <p>ひどい汚れの場合は追加清掃費が発生することがあります。</p>`
                    }
                },
                {
                    icon: "time",
                    title: { en: "Early/Late Check-in", jp: "アーリー/レートチェックイン" },
                    content: {
                        en: `<p><strong>Early Check-in:</strong> Subject to availability, ¥3,000/hour</p>
                        <p><strong>Late Check-out:</strong> Subject to availability, ¥3,000/hour</p>
                        <p>Please contact us in advance to arrange.</p>`,
                        jp: `<p><strong>アーリーチェックイン:</strong> 空き状況による、1時間3,000円</p>
                        <p><strong>レイトチェックアウト:</strong> 空き状況による、1時間3,000円</p>
                        <p>事前にご連絡ください。</p>`
                    }
                },
                {
                    icon: "money",
                    title: { en: "Pricing by Headcount", jp: "人数における料金帯の変化" },
                    content: {
                        en: `<p>Base price includes up to 6 guests.</p>
                        <p>Additional guests: ¥5,000 per person per night</p>
                        <p>Maximum capacity: 8 guests</p>`,
                        jp: `<p>基本料金は6名様まで。</p>
                        <p>追加のお客様: 1人1泊5,000円</p>
                        <p>最大定員: 8名</p>`
                    }
                },
                {
                    icon: "trash",
                    title: { en: "Trash Rules", jp: "ゴミルール" },
                    content: {
                        en: `<p>Please take all trash with you when you leave.</p>
                        <p>There is no trash collection service.</p>
                        <p>See the Trash Disposal section under Facilities for sorting guidelines.</p>`,
                        jp: `<p>チェックアウト時にゴミはお持ち帰りください。</p>
                        <p>ゴミ収集サービスはありません。</p>
                        <p>分別方法は「施設」の「ゴミの捨て方」をご覧ください。</p>`
                    }
                },
                {
                    icon: "amenities",
                    title: { en: "Emergency Contacts", jp: "緊急連絡先" },
                    content: {
                        en: `<p><strong>Emergency (Police, Fire, Ambulance):</strong> 110 / 119</p>
                        <p><strong>Property Manager:</strong> 090-XXXX-XXXX</p>
                        <p><strong>Nearest Hospital:</strong> Shinanomachi Central Hospital, 15 min drive</p>`,
                        jp: `<p><strong>緊急（警察・消防・救急）:</strong> 110 / 119</p>
                        <p><strong>管理者:</strong> 090-XXXX-XXXX</p>
                        <p><strong>最寄りの病院:</strong> 信濃町中央病院、車15分</p>`
                    }
                }
            ]
        },
        {
            id: "faq",
            title: { en: "FAQ", jp: "よくある質問" },
            items: [
                {
                    icon: "luggage",
                    title: { en: "Luggage Delivery", jp: "荷物を配送したい場合" },
                    content: {
                        en: `<p>You can send luggage to the property before arrival using Yamato Transport (Kuroneko).</p>
                        <p><strong>Address:</strong> [Property Address Here]</p>
                        <p><strong>Recipient:</strong> Your Name + "Guest"</p>
                        <p>Please coordinate delivery date with check-in date.</p>`,
                        jp: `<p>ヤマト運輸で事前に荷物を送ることができます。</p>
                        <p><strong>住所:</strong> [物件住所]</p>
                        <p><strong>宛名:</strong> お名前 + 「ゲスト様」</p>
                        <p>チェックイン日に届くよう手配してください。</p>`
                    }
                },
                {
                    icon: "power",
                    title: { en: "Power Outage", jp: "ブレーカーが落ちた場合" },
                    content: {
                        en: `<p>The breaker panel is located in the utility room near the entrance.</p>
                        <p>If the power goes out, check if the main breaker has tripped.</p>
                        <p>Flip the switch back to the ON position.</p>
                        <p>If problems persist, contact the property manager.</p>`,
                        jp: `<p>分電盤は玄関近くのユーティリティルームにあります。</p>
                        <p>停電した場合は、ブレーカーが落ちていないか確認してください。</p>
                        <p>スイッチをONの位置に戻してください。</p>
                        <p>問題が続く場合は管理者にご連絡ください。</p>`
                    }
                },
                {
                    icon: "receipt",
                    title: { en: "Receipts", jp: "領収書の発行方法" },
                    content: {
                        en: `<p>A receipt will be automatically sent to your email after payment.</p>
                        <p>If you need a formal invoice for business purposes, please contact us with the required name/company information.</p>`,
                        jp: `<p>支払い後、領収書が自動でメールに届きます。</p>
                        <p>法人名での正式な領収書が必要な場合は、必要な情報をお知らせください。</p>`
                    }
                }
            ]
        }
    ],
    services: [
        {
            id: 1,
            name: { en: "SUP Board Rental", jp: "SUPボードレンタル" },
            price: 3000,
            description: { en: "Per day, includes paddle and life jacket", jp: "1日あたり、パドル・ライフジャケット付き" },
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
            icon: "sup"
        },
        {
            id: 2,
            name: { en: "BBQ Grill Set", jp: "BBQグリルセット" },
            price: 5000,
            description: { en: "Includes grill, charcoal, and utensils", jp: "グリル・炭・調理器具付き" },
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
            icon: "bbq"
        },
        {
            id: 3,
            name: { en: "Late Checkout (per hour)", jp: "レイトチェックアウト（1時間）" },
            price: 3000,
            description: { en: "Subject to availability", jp: "空き状況による" },
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            icon: "clock"
        },
        {
            id: 4,
            name: { en: "Bicycle Rental", jp: "自転車レンタル" },
            price: 2000,
            description: { en: "Per day, helmet included", jp: "1日あたり、ヘルメット付き" },
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            icon: "bicycle"
        },
        {
            id: 5,
            name: { en: "Fishing Equipment", jp: "釣り道具" },
            price: 2500,
            description: { en: "Rod, tackle, and bait included", jp: "竿・仕掛け・餌付き" },
            image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400",
            icon: "fishing"
        },
        {
            id: 6,
            name: { en: "Firewood Bundle", jp: "薪セット" },
            price: 1500,
            description: { en: "For outdoor firepit use", jp: "屋外焚き火用" },
            image: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?w=400",
            icon: "fire"
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

    // Store original toggleLanguage and extend it
    const originalToggle = window.toggleLanguage;
    window.toggleLanguage = () => {
        if (originalToggle) originalToggle();
        // Re-render guidebook content when language changes
        renderGuidebook();
    };

    // Initialize New Navigation
    renderTopNav();
    // Initialize New Navigation
    renderTopNav();
    switchCategory('access'); // Default to access
});

const categories = [
    { id: 'access', title: { en: 'Access', jp: 'アクセス' }, icon: 'address' },
    { id: 'services', title: { en: 'Paid Services', jp: '有料サービス' }, icon: 'amenities' },
    { id: 'facility', title: { en: 'Facilities', jp: '施設' }, icon: 'rooms' },
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

function initSearch() {
    const searchInput = document.getElementById('guidebook-search');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Build searchable index
    const searchIndex = buildSearchIndex();

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

    // Update placeholder based on language
    updateSearchPlaceholder(searchInput);
}

function updateSearchPlaceholder(searchInput) {
    const lang = getLang();
    searchInput.placeholder = lang === 'jp' ? 'ガイドブックを検索...' : 'Search guidebook...';
}

function buildSearchIndex() {
    const index = [];
    const lang = getLang();

    // Add Access items
    if (guidebookData.access && guidebookData.access.items) {
        guidebookData.access.items.forEach((item, idx) => {
            const title = getLocalizedText(item.title);
            const content = stripHtml(getLocalizedText(item.content));
            index.push({
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
            index.push({
                id: `item-${section.id}-${idx}`,
                sectionId: section.id,
                title: title,
                content: content,
                category: getLocalizedText(section.title)
            });
        });
    });

    return index;
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
