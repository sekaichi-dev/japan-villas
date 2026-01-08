// In-memory cache (Global scope persists for hot instances)
let cachedProperties = null;
let lastFetchTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function onRequest(context) {
    const { env } = context;

    // 1. Check Cache
    const now = Date.now();
    if (cachedProperties && (now - lastFetchTime < CACHE_TTL)) {
        return new Response(JSON.stringify(cachedProperties), {
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    }

    // 2. Fetch from Beds24
    if (!env.BEDS24_API_TOKEN) {
        return new Response(JSON.stringify({ error: "Missing API Token" }), { status: 500 });
    }

    try {
        // v2 properties endpoint
        const response = await fetch("https://api.beds24.com/v2/properties?include=content", {
            headers: {
                "token": env.BEDS24_API_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`Beds24 API Error: ${response.status}`);
        }

        const json = await response.json();
        // Beds24 v2 response: { success: true, data: [ ... ] } or just [ ... ] depending on version/endpoint
        // Safe check for data array
        const apiProperties = Array.isArray(json) ? json : (json.data || []);

        // 3. Normalize Data to Frontend Contract
        const normalizedProperties = apiProperties.map(p => {
            const content = p.content || {};
            // Images: API usually returns array of objects { url: "..." } in content.images
            const rawImages = content.pictures || content.images || [];
            const images = Array.isArray(rawImages)
                ? rawImages.map(img => img.url || img.src || img)
                : [];

            if (images.length === 0) images.push("images/placeholder.jpg");

            // Amenities: often an array of objects or strings in content
            const rawAmenities = content.amenities || [];
            const features = Array.isArray(rawAmenities)
                ? rawAmenities.map(a => typeof a === 'object' ? (a.name || a.text) : a)
                : ["Luxury Stay"];

            return {
                id: p.id || p.propId,
                name: p.name || content.name || "Unknown Property",
                location: (p.city && p.country) ? `${p.city}, ${p.country}` : (p.address || "Japan"),
                lat: parseFloat(p.latitude) || 0,
                lng: parseFloat(p.longitude) || 0,
                price: 55000, // Placeholder
                images: images,
                details: {
                    bedrooms: parseInt(p.numBedrooms || content.bedrooms || 2),
                    guests: parseInt(p.maxPeople || p.maxGuests || 4),
                    bath: parseInt(p.bathrooms || content.bathrooms || 1)
                },
                features: features.slice(0, 5) // Limit to 5 for UI consistency
            };
        });

        // 4. Update Cache
        if (normalizedProperties.length > 0) {
            cachedProperties = normalizedProperties;
            lastFetchTime = now;
        }

        return new Response(JSON.stringify(normalizedProperties), {
            headers: { "content-type": "application/json;charset=UTF-8" }
        });

    } catch (err) {
        console.error("Backend Error:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
}
