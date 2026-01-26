/**
 * Data Loader for Beds24 API Integration
 * 
 * This module fetches availability data from the Beds24 API and maps it to
 * the frontend property model expected by the UI components (hero slideshow,
 * map markers, property cards).
 * 
 * How Beds24 data is transformed:
 * 1. API returns: { success, type, count, data: [{roomId, propertyId, name, availability}] }
 * 2. We use a static PROPERTY_CATALOG keyed by roomId with all UI-required fields
 * 3. Each Beds24 room is enriched with catalog data to produce the full property object
 */

// Static property catalog with all UI-required fields
// Keyed by Beds24 roomId for fast lookup
const PROPERTY_CATALOG = {
    557549: {
        id: 1,
        roomId: 557549,
        propId: 265981,
        minStay: 2,
        name: "Mountain Villa Niseko",
        name_jp: "マウンテンヴィラ ニセコ",
        location: "Niseko, Hokkaido",
        location_jp: "北海道 ニセコ",
        price: 150000,
        images: ["images/prop_niseko.png"],
        description: "A luxury ski-in ski-out sanctuary with panoramic views of Mt. Yotei. Features a private onsen, floor-to-ceiling windows, and a chef's kitchen tailored for après-ski entertaining.",
        description_jp: "羊蹄山のパノラマビューを楽しめる、豪華なスキーイン・スキーアウトの聖域。専用温泉、床から天井までの窓、アフタースキーのおもてなしに最適なシェフキッチンを備えています。",
        amenities: ["Ski-in/Ski-out", "Mt. Yotei View", "Private Onsen", "Fireplace", "Concierge"],
        amenities_jp: ["スキーイン/アウト", "羊蹄山ビュー", "専用温泉", "暖炉", "コンシェルジュ"],
        features: ["Mountain", "Ski", "Countryside"],
        details: { guests: 8, bedrooms: 4, bath: 4 },
        coordinates: { top: "20%", left: "78%" },
        instagram: "https://www.instagram.com/mountainvilla_niseko_/"
    },
    557548: {
        id: 2,
        roomId: 557548,
        propId: 265980,
        minStay: 2,
        name: "Lake House Nojiriko",
        name_jp: "レイクハウス 野尻湖",
        location: "Nojiri Lake, Nagano",
        location_jp: "長野県 野尻湖",
        price: 65000,
        images: ["images/prop_nojiri_cabin.png"],
        description: "A serene lakeside cabin designed to blend with the surrounding forest. Direct access to the water and a spacious deck make this the ultimate nature retreat.",
        description_jp: "周囲の森に溶け込むように設計された静かな湖畔のキャビン。水辺への直接アクセスと広々としたデッキが、究極の自然リトリートを実現します。",
        amenities: ["Lake Access", "Wood Stove", "BBQ Deck", "Canoe", "Pet Friendly"],
        amenities_jp: ["湖へのアクセス", "薪ストーブ", "BBQデッキ", "カヌー", "ペット可"],
        features: ["Lake", "Countryside", "Mountain"],
        details: { guests: 6, bedrooms: 3, bath: 2 },
        coordinates: { top: "48%", left: "62%" },
        instagram: "https://www.instagram.com/the__lake__house__/"
    },
    586803: {
        id: 3,
        roomId: 586803,
        propId: 281224,
        minStay: 1,
        name: "Lake Side Inn Nojiriko",
        name_jp: "レイクサイドイン 野尻湖",
        location: "Nojiri Lake, Nagano",
        location_jp: "長野県 野尻湖",
        price: 35000,
        images: ["images/prop_nojiri_inn.png"],
        description: "A collection of renovating trailer houses offering a chic, glamping-style experience right on the shore. Perfect for digital nomads and pet owners seeking community and nature.",
        description_jp: "湖畔でシックなグランピングスタイル体験を提供するリノベーション済みのトレーラーハウス。コミュニティと自然を求めるデジタルノマドやペットオーナーに最適です。",
        amenities: ["Coworking Space", "Community Kitchen", "Pet Friendly", "Lake View", "Sauna"],
        amenities_jp: ["コワーキング", "共有キッチン", "ペット可", "レイクビュー", "サウナ"],
        features: ["Lake", "Countryside"],
        details: { guests: 2, bedrooms: 1, bath: 1 },
        coordinates: { top: "50%", left: "63%" },
        instagram: "https://www.instagram.com/the_lake_side_nojiriko/"
    },
    // Placeholder for properties not yet in Beds24 - keyed by local id for fallback
    "_local_4": {
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
        coordinates: { top: "60%", left: "65%" },
        instagram: "https://www.instagram.com/sajimastay/"
    },
    "_local_5": {
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
        coordinates: { top: "62%", left: "58%" }
    }
};

/**
 * Get all catalog properties as a fallback array (sorted by id)
 */
function getFallbackProperties() {
    return Object.values(PROPERTY_CATALOG)
        .filter(p => typeof p.id === 'number')
        .sort((a, b) => a.id - b.id);
}

/**
 * Load properties from Beds24 API and map to frontend model
 * @returns {Promise<Array>} Array of property objects for UI rendering
 */
async function loadProperties() {
    try {
        // Fetch from Beds24 availability API
        const res = await fetch("/api/beds24/availability");
        if (!res.ok) {
            console.error("[loadProperties] API Error:", res.status, res.statusText);
            throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const response = await res.json();

        // DEBUG: Confirm Beds24 data loaded
        console.log("[loadProperties] Beds24 data loaded:", {
            success: response.success,
            type: response.type,
            count: response.count
        });

        // Validate response shape
        if (!response.data || !Array.isArray(response.data)) {
            console.warn("[loadProperties] Unexpected response shape, using fallback");
            return getFallbackProperties();
        }

        // Map Beds24 rooms to frontend property model
        const mappedProperties = [];

        for (const room of response.data) {
            const roomId = room.roomId;
            const catalogEntry = PROPERTY_CATALOG[roomId];

            if (catalogEntry) {
                // Enrich with availability data from API
                const property = {
                    ...catalogEntry,
                    // Store raw availability for calendar/booking use
                    _availability: room.availability || {}
                };
                mappedProperties.push(property);
            } else {
                console.warn(`[loadProperties] Unknown roomId ${roomId}, skipping`);
            }
        }

        // Sort by id for consistent rendering order
        mappedProperties.sort((a, b) => a.id - b.id);

        // DEBUG: Confirm mapped count
        console.log("[loadProperties] Mapped", mappedProperties.length, "properties");

        // If no properties mapped (API returned rooms we don't recognize), use fallback
        if (mappedProperties.length === 0) {
            console.warn("[loadProperties] No properties mapped from API, using fallback");
            return getFallbackProperties();
        }

        return mappedProperties;

    } catch (e) {
        console.warn("[loadProperties] API unavailable:", e.message, "- using local fallback data");
        return getFallbackProperties();
    }
}
