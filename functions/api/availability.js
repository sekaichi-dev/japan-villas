export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!roomId || !startDate || !endDate) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    // Use env token if available, otherwise fallback to the provided test token (NOT RECOMMENDED FOR PROD, used here for immediate testing as requested)
    const token = env.BEDS24_API_TOKEN || "N8wRcYY7gwnvnbi7suQv/CqvzgzA3czPYrps2Qf53jmd5adP5lAo8dtrMntML5OFGkPgfJ4Us+kCTTIk/eIMscmEotKyuYQdHv9ktFpMumCXadCewdqKy0zX8n4TjrA+3NDgWdPJsvAqs5ebHHkhcYa7uTeGFe/Go1SfFE4eIbY=";

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
            throw new Error(`Beds24 API error: ${response.status}`);
        }

        const data = await response.json();

        // Return raw data or normalized? The user asked to parse it but might be easier to pass to frontend.
        // User said: "Parse the availability map... The API returns..."
        // I'll return the raw data and let the frontend parsing logic handle it as requested in prompt "Data Parsing & Visualization" section is usually frontend logic.
        // ACTUALLY, sticking to the proxy pattern, I will forward the response.

        return new Response(JSON.stringify(data), {
            headers: { "content-type": "application/json" }
        });

    } catch (err) {
        console.error("Availability API Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
