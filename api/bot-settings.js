
// This file delegates to admin-chat.js for logic, or can be standalone.
// Since we combined logic in admin-chat.js for the draft, we can import it.
// Assuming the user's setup routes /api/files automatically.

const adminHandler = require('./admin-chat.js');

module.exports = async (req, res) => {
    // Manually force the 'bot-settings' path context if needed, 
    // or just let the handler router decide.
    // Ideally this file handles just settings.

    // For this implementation, I'll copy the specific settings logic here 
    // so `api/bot-settings` works as a standalone endpoint file.

    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('bot_settings')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data || {
            system_prompt: "",
            use_guidebook: true,
            training_examples: []
        });

    } else if (req.method === 'POST') {
        const { system_prompt, use_guidebook, training_examples } = req.body;

        // Upsert Singleton (ID=1)
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
    }
};
