// Vercel Serverless Function: /api/beds24/availability.js

export default async function handler(req, res) {
    const { roomId, startDate, endDate } = req.query;

    if (!roomId || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required parameters (roomId, startDate, endDate)" });
    }

    const token = process.env.BEDS24_TOKEN;
    if (!token) {
        console.error("Missing BEDS24_TOKEN");
        return res.status(500).json({ error: "Server Configuration Error" });
    }

    try {
        const bedsUrl = `https://api.beds24.com/v2/inventory/rooms/availability?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`;

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
        return res.status(200).json(data);

    } catch (err) {
        console.error("Availability API Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
