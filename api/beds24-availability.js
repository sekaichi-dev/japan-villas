// Vercel Serverless Function: /api/beds24-availability
// 
// Beds24 API v2 Authentication:
// This API requires a custom HTTP header "token" (NOT Authorization header).
// This matches the exact format shown in the Beds24 Swagger UI.
//
// Example URLs:
//   /api/beds24-availability
//   /api/beds24-availability?roomId=557549
//

export default async function handler(req, res) {
  try {
    // GET only
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Load and validate token
    const rawToken = process.env.BEDS24_TOKEN;
    if (!rawToken) {
      console.error("[beds24-availability] BEDS24_TOKEN env var is undefined");
      return res.status(500).json({ error: "Missing BEDS24_TOKEN env var" });
    }

    // Trim whitespace - critical for token validity
    const token = rawToken.trim();
    if (!token) {
      console.error("[beds24-availability] BEDS24_TOKEN is empty after trim");
      return res.status(500).json({ error: "BEDS24_TOKEN is empty" });
    }

    // DEBUG: Log token metadata (masked for security)
    console.log("[beds24-availability] Token length:", token.length);
    console.log("[beds24-availability] Token prefix:", token.substring(0, 4) + "***");

    // Beds24 API v2 endpoint - per Swagger UI specification
    // Note: The correct domain is beds24.com, NOT api.beds24.com
    const baseUrl = "https://beds24.com/api/v2/inventory/rooms/availability";

    // Build query string from forwarded parameters (token is NOT in query string)
    let queryParts = [];
    for (const [k, v] of Object.entries(req.query || {})) {
      if (typeof v === "string" && k !== "token") {
        queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }
    }

    const fullUrl = queryParts.length > 0
      ? `${baseUrl}?${queryParts.join("&")}`
      : baseUrl;

    // DEBUG: Log request details
    console.log("[beds24-availability] Request URL:", fullUrl);
    console.log("[beds24-availability] Method: GET");

    // Beds24 API v2 requires authentication via custom "token" HTTP header
    // This matches the exact format shown in Swagger UI - NOT Authorization header
    const headers = {
      "accept": "application/json",
      "token": token
    };
    console.log("[beds24-availability] Headers:", JSON.stringify({
      accept: headers.accept,
      token: headers.token.substring(0, 4) + "***REDACTED***"
    }));

    // Make request
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers
    });

    // DEBUG: Log response status
    console.log("[beds24-availability] Response status:", response.status);

    // Get raw response body
    const responseText = await response.text();
    console.log("[beds24-availability] Response body length:", responseText.length);

    // Try to parse as JSON, but return raw if parsing fails
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("[beds24-availability] JSON parse failed, returning raw text");
      return res.status(response.status).json({
        error: "Invalid JSON from Beds24",
        rawResponse: responseText.substring(0, 500)
      });
    }

    // Return with original status code
    return res.status(response.status).json(responseData);

  } catch (err) {
    console.error("[beds24-availability] Server error:", err.message);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
