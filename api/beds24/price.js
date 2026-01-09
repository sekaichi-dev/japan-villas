// Vercel Serverless Function: /api/beds24/price.js

export default async function handler(req, res) {
    const { roomId, arrival, departure, numAdults = 2 } = req.query;

    if (!roomId || !arrival || !departure) {
        return res.status(400).json({ error: "Missing required parameters (roomId, arrival, departure)" });
    }

    const token = process.env.BEDS24_TOKEN;
    if (!token) {
        console.error("Missing BEDS24_TOKEN");
        return res.status(500).json({ error: "Server Configuration Error" });
    }

    try {
        const bedsUrl = `https://api.beds24.com/v2/inventory/rooms/offers?roomId=${roomId}&arrival=${arrival}&departure=${departure}&numAdults=${numAdults}`;

        const response = await fetch(bedsUrl, {
            method: 'GET',
            headers: {
                'token': token,
                'content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Beds24 endpoint error: ${response.status}`);
        }

        const data = await response.json();
        /* 
           Beds24 Offers API returns detailed pricing. 
           We forward it raw for the frontend to parse.
        */
        return res.status(200).json(data);

    } catch (err) {
        console.error("Price API Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
