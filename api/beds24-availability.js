// Vercel Serverless Function: /api/beds24-availability
// 
// Beds24 API v2 Authentication:
// This API requires a custom HTTP header "token" (NOT Authorization header).
// This matches the exact format shown in the Beds24 Swagger UI.
//
// Caching Strategy:
// - In-memory cache with 90-second TTL (availability doesn't need real-time freshness)
// - HTTP Cache-Control headers for CDN/browser caching
// - Cache key = sorted query string for consistent hits
//
// Example URLs:
//   /api/beds24-availability
//   /api/beds24-availability?roomId=557549
//

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================
// Simple cache object stored in module scope (persists across requests in same
// serverless instance). Safe for read-only data like availability.
// ============================================================================

const cache = new Map();
const CACHE_TTL_MS = 90 * 1000; // 90 seconds

/**
 * Generate a stable cache key from query parameters
 * @param {Object} query - Request query object
 * @returns {string} Cache key
 */
function getCacheKey(query) {
  const params = Object.entries(query || {})
    .filter(([k, v]) => k !== "token" && typeof v === "string")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return params || "__default__";
}

/**
 * Get cached response if valid
 * @param {string} key - Cache key
 * @returns {Object|null} Cached data or null if expired/missing
 */
function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return { data: entry.data, age };
}

/**
 * Store response in cache
 * @param {string} key - Cache key
 * @param {Object} data - Response data to cache
 */
function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });

  // Prevent unbounded cache growth - keep max 100 entries
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

// ============================================================================
// REQUEST HANDLER
// ============================================================================

export default async function handler(req, res) {
  try {
    // GET only
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Generate cache key from query params
    const cacheKey = getCacheKey(req.query);

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log(`[beds24-availability] CACHE HIT (age: ${Math.round(cached.age / 1000)}s) key: ${cacheKey}`);

      // Set HTTP cache headers
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Cache-Age", Math.round(cached.age / 1000));

      return res.status(200).json(cached.data);
    }

    console.log(`[beds24-availability] CACHE MISS key: ${cacheKey}`);

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

    // Beds24 API v2 endpoint - per Swagger UI specification
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

    console.log("[beds24-availability] Fetching from Beds24:", fullUrl);

    // Make request to Beds24
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "token": token
      }
    });

    console.log("[beds24-availability] Beds24 response status:", response.status);

    // Get raw response body
    const responseText = await response.text();

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("[beds24-availability] JSON parse failed");
      return res.status(response.status).json({
        error: "Invalid JSON from Beds24",
        rawResponse: responseText.substring(0, 500)
      });
    }

    // Only cache successful responses
    if (response.status === 200) {
      setCache(cacheKey, responseData);
      console.log(`[beds24-availability] Cached response for key: ${cacheKey}`);
    }

    // Set HTTP cache headers (CDN + browser caching)
    // s-maxage: CDN caches for 60 seconds
    // stale-while-revalidate: Serve stale for 5 min while revalidating in background
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.setHeader("X-Cache", "MISS");

    return res.status(response.status).json(responseData);

  } catch (err) {
    console.error("[beds24-availability] Server error:", err.message);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
