
const { createClient } = require('@supabase/supabase-js');
// const Anthropic = require('@anthropic-ai/sdk'); // Uncomment if SDK is available

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL; // Verify env vars exist
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Anthropic
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function handleBotSettings(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('bot_settings')
            .select('*')
            .single(); // Assuming single config row

        if (error && error.code !== 'PGRST116') { // Ignore 'no rows' error
            return res.status(500).json({ error: error.message });
        }

        // Return default if empty
        return res.status(200).json(data || {
            system_prompt: "You are a helpful assistant for Japan Villas.",
            use_guidebook: true,
            training_examples: []
        });

    } else if (req.method === 'POST') {
        const { id, system_prompt, use_guidebook, training_examples } = req.body;

        // Upsert logic. If we have an ID, update it. If not, insert.
        // For simplicity, let's assume there's only one row with ID 1, or we upsert.

        const payload = {
            // id: id || 1, // Force ID 1 if creating a singleton
            system_prompt,
            use_guidebook,
            training_examples
        };

        // Note: Supabase upsert requires primary key match. 
        // We'll try to update if ID exists, or insert if no rows found in logic above.
        // Actually, easiest is to ensure ID=1 exists or use `upsert`.

        // Let's assume ID=1 is the singleton config
        payload.id = 1;

        const { data, error } = await supabase
            .from('bot_settings')
            .upsert(payload)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data[0]);
    }
}

async function handleChatSimulation(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, currentSettings } = req.body;

    // Construct System Prompt
    let systemPrompt = currentSettings.system_prompt || "You are a helpful assistant.";

    // Inject Guidebook if enabled (Mock implementation)
    if (currentSettings.use_guidebook) {
        // In reality, fetch guidebook content here
        const guidebookContext = "\n\n[Guidebook Content]: We have villas in Niseko and Kyoto. Check-in is 3PM. WiFi is free.";
        systemPrompt += guidebookContext;
    }

    // Construct Messages Array for Anthropic
    // Claude 3 Haiku supports system prompt as a separate top-level parameter, 
    // and a `messages` array for the conversation.

    const messages = [];

    // Inject Few-Shot Examples
    if (currentSettings.training_examples && currentSettings.training_examples.length > 0) {
        currentSettings.training_examples.forEach(ex => {
            messages.push({ role: "user", content: ex.user });
            messages.push({ role: "assistant", content: ex.ai });
        });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    try {
        // Call Anthropic API (Using fetch for zero-dependency draft)
        // IMPORTANT: In production, install @anthropic-ai/sdk

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
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
            const errText = await response.text();
            throw new Error(`Anthropic API Error: ${errText}`);
        }

        const data = await response.json();
        const reply = data.content[0].text;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Simulation error:", error);
        // Fallback mock response if API fails (for testing UI without keys)
        return res.status(500).json({
            reply: `[Error: ${error.message}] - Please check API keys.`
        });
    }
}

// Simple router for this file (assuming it's loaded by the main server app under /api)
// Adapt this to your actual server structure (Express vs Serverless)
module.exports = async (req, res) => {
    const url = req.url || '';

    if (url.includes('bot-settings')) {
        return handleBotSettings(req, res);
    }

    if (url.includes('chat-simulation')) {
        return handleChatSimulation(req, res);
    }

    return res.status(404).json({ error: 'Not found' });
};
