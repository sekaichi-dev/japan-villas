const { createClient } = require('@supabase/supabase-js');

// CORS headers for Vercel
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
            .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            .end();
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Missing Supabase configuration' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        if (req.method === 'GET') {
            // Fetch bot settings (singleton row)
            const { data, error } = await supabase
                .from('bot_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') {
                // PGRST116 = no rows returned, which is fine
                return res.status(500).json({ error: error.message });
            }

            // Return data or default values
            return res.status(200).json(data || {
                system_prompt: "You are a helpful assistant for Japan Villas.",
                use_guidebook: true,
                training_examples: []
            });

        } else if (req.method === 'POST') {
            // Update bot settings
            const { system_prompt, use_guidebook, training_examples } = req.body;

            // Upsert to singleton row (ID = 1)
            const payload = {
                id: 1,
                system_prompt,
                use_guidebook,
                training_examples
            };

            const { data, error } = await supabase
                .from('bot_settings')
                .upsert(payload)
                .select();

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data[0]);

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Bot settings error:', error);
        return res.status(500).json({ error: error.message });
    }
}
