async function loadProperties() {
    try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("API not found");
        return await res.json();
    } catch (e) {
        console.warn("API unavailable, using local fallback data.");
        return [
            {
                id: 1,
                name: "Mountain Villa Niseko",
                name_jp: "マウンテンヴィラ ニセコ",
                location: "Niseko, Hokkaido",
                location_jp: "北海道 ニセコ",
                price: 150000,
                // MOUNTAIN VILLA NISEKO
                roomId: 557549,
                propId: 265981,
                minStay: 2,
                images: ["images/prop_niseko.png"],
                description: "A luxury ski-in ski-out sanctuary with panoramic views of Mt. Yotei. Features a private onsen, floor-to-ceiling windows, and a chef's kitchen tailored for après-ski entertaining.",
                description_jp: "羊蹄山のパノラマビューを楽しめる、豪華なスキーイン・スキーアウトの聖域。専用温泉、床から天井までの窓、アフタースキーのおもてなしに最適なシェフキッチンを備えています。",
                amenities: ["Ski-in/Ski-out", "Mt. Yotei View", "Private Onsen", "Fireplace", "Concierge"],
                amenities_jp: ["スキーイン/アウト", "羊蹄山ビュー", "専用温泉", "暖炉", "コンシェルジュ"],
                features: ["Mountain", "Ski", "Countryside"],
                details: { guests: 8, bedrooms: 4, bath: 4 },
                coordinates: { top: "20%", left: "78%" }, // Approx Hokkaido
                instagram: "https://www.instagram.com/mountainvilla_niseko_/",
                availableFrom: "12/20"
            },
            {
                id: 2,
                name: "Lake House Nojiriko",
                name_jp: "レイクハウス 野尻湖",
                location: "Nojiri Lake, Nagano",
                location_jp: "長野県 野尻湖",
                price: 65000,
                // THE LAKE HOUSE NOJIRIKO
                roomId: 557548,
                propId: 265980,
                minStay: 2,
                images: ["images/prop_nojiri_cabin.png"],
                description: "A serene lakeside cabin designed to blend with the surrounding forest. Direct access to the water and a spacious deck make this the ultimate nature retreat.",
                description_jp: "周囲の森に溶け込むように設計された静かな湖畔のキャビン。水辺への直接アクセスと広々としたデッキが、究極の自然リトリートを実現します。",
                amenities: ["Lake Access", "Wood Stove", "BBQ Deck", "Canoe", "Pet Friendly"],
                amenities_jp: ["湖へのアクセス", "薪ストーブ", "BBQデッキ", "カヌー", "ペット可"],
                features: ["Lake", "Countryside", "Mountain"],
                details: { guests: 6, bedrooms: 3, bath: 2 },
                coordinates: { top: "48%", left: "62%" }, // Approx Nagano
                instagram: "https://www.instagram.com/the__lake__house__/",
                availableFrom: "01/15"
            },
            {
                id: 3,
                name: "Lake Side Inn Nojiriko",
                name_jp: "レイクサイドイン 野尻湖",
                location: "Nojiri Lake, Nagano",
                location_jp: "長野県 野尻湖",
                price: 35000,
                // THE LAKE SIDE INN NOJIRIKO
                roomId: 586803,
                propId: 281224,
                minStay: 1,
                images: ["images/prop_nojiri_inn.png"],
                description: "A collection of renovating trailer houses offering a chic, glamping-style experience right on the shore. Perfect for digital nomads and pet owners seeking community and nature.",
                description_jp: "湖畔でシックなグランピングスタイル体験を提供するリノベーション済みのトレーラーハウス。コミュニティと自然を求めるデジタルノマドやペットオーナーに最適です。",
                amenities: ["Coworking Space", "Community Kitchen", "Pet Friendly", "Lake View", "Sauna"],
                amenities_jp: ["コワーキング", "共有キッチン", "ペット可", "レイクビュー", "サウナ"],
                features: ["Lake", "Countryside"],
                details: { guests: 2, bedrooms: 1, bath: 1 },
                coordinates: { top: "50%", left: "63%" }, // Slightly offset from other Nojiri property
                instagram: "https://www.instagram.com/the_lake_side_nojiriko/",
                availableFrom: "02/01"
            },
            {
                id: 4,
                name: "Shonan Sajima Stay",
                name_jp: "湘南 佐島ステイ",
                location: "Yokosuka, Kanagawa",
                location_jp: "神奈川県 横須賀市",
                price: 45000,
                images: ["images/prop_sajima.png"],
                description: "An exclusive oceanfront apartment on the Sajima coast. Watch the sunset over Mt. Fuji from your living room in this modern, minimalist escape.",
                description_jp: "佐島海岸にある高級オーシャンフロントアパートメント。このモダンでミニマルな隠れ家のリビングルームから、富士山に沈む夕日を眺めることができます。",
                amenities: ["Oceanfront", "Sunset View", "Roof Terrace", "Designer Furniture", "Free Parking"],
                amenities_jp: ["オーシャンフロント", "サンセット", "ルーフテラス", "デザイナー家具", "無料駐車場"],
                features: ["Ocean", "Beach", "City"],
                details: { guests: 4, bedrooms: 2, bath: 1 },
                coordinates: { top: "60%", left: "65%" }, // Kanagawa coast
                instagram: "https://www.instagram.com/sajimastay/",
                availableFrom: "03/10"
            },
            {
                id: 5,
                name: "Kyoto Machiya Stay",
                name_jp: "京都 町家ステイ",
                location: "Kyoto City",
                location_jp: "京都市",
                price: 55000,
                images: ["images/prop_kyoto.png"],
                description: "A beautifully restored traditional Machiya townhouse. Authentic architectural details meet modern luxury, located in a quiet historic district walking distance to Gion.",
                description_jp: "美しく修復された伝統的な京町家。祇園まで徒歩圏内の静かな歴史地区に位置し、本物の建築ディテールと現代的なラグジュアリーが融合しています。",
                amenities: ["Garden View", "Hinoki Bath", "Tatami Rooms", "Tea Set", "Bicycles"],
                amenities_jp: ["庭園ビュー", "檜風呂", "畳の部屋", "茶器セット", "自転車"],
                features: ["City", "Countryside"],
                details: { guests: 5, bedrooms: 3, bath: 2 },
                coordinates: { top: "62%", left: "58%" }, // Kyoto
                availableFrom: "04/05"
            }
        ];
    }
}
