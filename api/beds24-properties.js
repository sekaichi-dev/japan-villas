export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            res.setHeader("Allow", "GET");
            return res.status(405).json({ error: "Method not allowed" });
        }

        const token = (process.env.BEDS24_TOKEN || "").trim();
        if (!token) {
            console.error("[beds24-properties] Missing or empty BEDS24_TOKEN");
            return res.status(500).json({ error: "Missing BEDS24_TOKEN env var" });
        }

        // Fetch properties from Beds24 API v2
        const beds24Url = "https://api.beds24.com/v2/properties?include=content";

        const r = await fetch(beds24Url, {
            method: "GET",
            headers: {
                "token": token,
                "Accept": "application/json"
            }
        });

        if (!r.ok) {
            const text = await r.text();
            return res.status(r.status).json({
                error: "Beds24 API error",
                status: r.status,
                details: text
            });
        }

        const json = await r.json();
        const apiProperties = Array.isArray(json) ? json : (json.data || []);

        // Normalize data for frontend
        const normalizedProperties = apiProperties.map(p => {
            const content = p.content || {};
            const rawImages = content.pictures || content.images || [];
            const images = Array.isArray(rawImages)
                ? rawImages.map(img => img.url || img.src || img)
                : [];

            if (images.length === 0) images.push("images/placeholder.jpg");

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
                price: 55000,
                images: images,
                details: {
                    bedrooms: parseInt(p.numBedrooms || content.bedrooms || 2),
                    guests: parseInt(p.maxPeople || p.maxGuests || 4),
                    bath: parseInt(p.bathrooms || content.bathrooms || 1)
                },
                features: features.slice(0, 5)
            };
        });

        return res.status(200).json(normalizedProperties);

    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
