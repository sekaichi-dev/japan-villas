export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
    const arrival = url.searchParams.get("arrival");
    const departure = url.searchParams.get("departure");
    const numAdults = url.searchParams.get("numAdults") || "2";

    if (!roomId || !arrival || !departure) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    // Use env token query or fallback (TEST ONLY)
    const token = env.BEDS24_API_TOKEN || "N8wRcYY7gwnvnbi7suQv/CqvzgzA3czPYrps2Qf53jmd5adP5lAo8dtrMntML5OFGkPgfJ4Us+kCTTIk/eIMscmEotKyuYQdHv9ktFpMumCXadCewdqKy0zX8n4TjrA+3NDgWdPJsvAqs5ebHHkhcYa7uTeGFe/Go1SfFE4eIbY=";

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
            throw new Error(`Beds24 API error: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { "content-type": "application/json" }
        });

    } catch (err) {
        console.error("Price API Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
