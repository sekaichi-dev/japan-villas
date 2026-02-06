// CORS headers for Vercel
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200)
            .setHeader('Access-Control-Allow-Origin', '*')
            .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
            .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            .end();
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, currentSettings } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Construct System Prompt
        let systemPrompt = currentSettings?.system_prompt || "You are a helpful assistant for Japan Villas.";

        // Inject Guidebook context if enabled
        if (currentSettings?.use_guidebook) {
            const guidebookContext = "\n\n[Guidebook Context]: We offer luxury villas in Niseko and Kyoto. Check-in is 3PM, check-out is 11AM. Free WiFi is included. For reservations, contact our concierge.";
            systemPrompt += guidebookContext;
        }

        // Build messages array for Claude
        const messages = [];

        // Add training examples (few-shot learning)
        if (currentSettings?.training_examples && currentSettings.training_examples.length > 0) {
            currentSettings.training_examples.forEach(example => {
                messages.push({ role: "user", content: example.user });
                messages.push({ role: "assistant", content: example.ai });
            });
        }

        // Add current user message
        messages.push({ role: "user", content: message });

        // Call Anthropic API
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

        if (!anthropicApiKey) {
            return res.status(500).json({
                error: 'Missing Anthropic API key',
                reply: '[Configuration Error] Anthropic API key not configured. Please add ANTHROPIC_API_KEY to environment variables.'
            });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': anthropicApiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                system: systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Anthropic API error:', errorText);
            throw new Error(`Anthropic API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const reply = data.content[0].text;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Chat simulation error:', error);
        return res.status(500).json({
            error: error.message,
            reply: `[Error] Failed to generate response: ${error.message}`
        });
    }
}
