// /api/beds24/token.js
export default async function handler(req, res) {
    try {
        const refreshToken = process.env.BEDS24_REFRESH_TOKEN;
        if (!refreshToken) {
            return res.status(500).json({ success: false, error: "Missing BEDS24_REFRESH_TOKEN" });
        }

        const r = await fetch("https://beds24.com/api/v2/authentication/token", {
            method: "GET",
            headers: {
                accept: "application/json",
                refreshToken,
            },
        });

        const text = await r.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        if (!r.ok) {
            return res.status(r.status).json({ success: false, status: r.status, data });
        }

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ success: false, error: String(e) });
    }
}
