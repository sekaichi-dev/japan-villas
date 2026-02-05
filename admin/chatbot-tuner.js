
// DOM Elements
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const systemPromptInput = document.getElementById('system-prompt');
const useGuidebookCheckbox = document.getElementById('use-guidebook');
const examplesList = document.getElementById('examples-list');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const resetChatBtn = document.getElementById('reset-chat-btn');
const exampleCountBadge = document.getElementById('example-count');

// State
let currentSettings = {
    id: null,
    system_prompt: '',
    use_guidebook: true,
    training_examples: []
};

// --- Initialization ---

async function init() {
    await fetchSettings();
    renderSettings();
    renderExamples();
}

// --- API Calls ---

async function fetchSettings() {
    try {
        const res = await fetch('/api/bot-settings');
        if (res.ok) {
            const data = await res.json();
            // Assuming the API returns the first row or a specific config object
            if (data) {
                currentSettings = { ...currentSettings, ...data };
            }
        }
    } catch (err) {
        console.error('Failed to fetch settings:', err);
    }
}

async function saveSettings() {
    const originalText = saveSettingsBtn.innerText;
    saveSettingsBtn.innerText = 'Saving...';
    saveSettingsBtn.disabled = true;

    // Update state from inputs before saving
    currentSettings.system_prompt = systemPromptInput.value;
    currentSettings.use_guidebook = useGuidebookCheckbox.checked;

    try {
        const res = await fetch('/api/bot-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSettings)
        });

        if (res.ok) {
            // Flash success
            saveSettingsBtn.innerText = 'Saved!';
            setTimeout(() => {
                saveSettingsBtn.innerText = originalText;
                saveSettingsBtn.disabled = false;
            }, 1000);
        } else {
            alert('Error saving settings');
            saveSettingsBtn.innerText = originalText;
            saveSettingsBtn.disabled = false;
        }
    } catch (err) {
        console.error('Save failed:', err);
        saveSettingsBtn.innerText = originalText;
        saveSettingsBtn.disabled = false;
    }
}

async function sendChatMessage(message) {
    try {
        const res = await fetch('/api/chat-simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                // We send current *unsaved* settings to simulate with what's on screen
                currentSettings: {
                    system_prompt: systemPromptInput.value,
                    use_guidebook: useGuidebookCheckbox.checked,
                    training_examples: currentSettings.training_examples
                }
            })
        });

        const data = await res.json();
        return data.reply; // Assuming { reply: "AI response..." }
    } catch (err) {
        console.error('Chat failed:', err);
        return "Error connecting to AI.";
    }
}

// --- UI Rendering ---

function renderSettings() {
    systemPromptInput.value = currentSettings.system_prompt || '';
    useGuidebookCheckbox.checked = currentSettings.use_guidebook;
}

function renderExamples() {
    const examples = currentSettings.training_examples || [];
    exampleCountBadge.innerText = `${examples.length} examples`;

    if (examples.length === 0) {
        examplesList.innerHTML = `
            <div class="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No examples yet. Chat with the AI and click "🧠" to save good responses.
            </div>`;
        return;
    }

    examplesList.innerHTML = examples.map((ex, index) => `
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm relative group">
            <button onclick="deleteExample(${index})" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                🗑️
            </button>
            <div class="mb-2">
                <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">User</span>
                <p class="text-gray-800 mt-1">${escapeHtml(ex.user)}</p>
            </div>
            <div>
                <span class="text-xs font-bold text-emerald-600 uppercase tracking-wide">AI</span>
                <p class="text-gray-600 mt-1">${escapeHtml(ex.ai)}</p>
            </div>
        </div>
    `).join('');
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${role === 'user' ? 'user-bubble' : 'ai-bubble'} self-${role === 'user' ? 'end' : 'start'}`;

    // Convert newlines to breaks for display
    const formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = formattedText;

    if (role === 'ai') {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-brain-btn';
        saveBtn.innerText = '🧠';
        saveBtn.title = 'Save this pair to training examples';

        // Find the last user message to pair with
        saveBtn.onclick = () => addToBrain(text);

        div.appendChild(saveBtn);
    }

    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// --- Logic ---

function addToBrain(aiText) {
    // Find the last user message. Note: this is a simple heuristic.
    // In a real app, we might link them more explicitly.
    // Here we assume the flow is always User -> AI.

    // Get all user bubbles
    const userBubbles = chatLog.querySelectorAll('.user-bubble');
    if (userBubbles.length === 0) return;

    const lastUserText = userBubbles[userBubbles.length - 1].innerText;

    const newExample = {
        user: lastUserText,
        ai: aiText
    };

    // Add to state
    currentSettings.training_examples.push(newExample);

    // Update UI
    renderExamples();

    // Optional: Auto-save? or let user click "Save Configuration".
    // User requirement: "Clicking ... populates the Training Examples list". 
    // It implies just state update, explicit save later is safer.

    // Visual feedback
    const btn = event.target;
    btn.innerText = '✅';
    setTimeout(() => btn.innerText = '🧠', 1500);
}

window.deleteExample = (index) => {
    if (confirm('Remove this example?')) {
        currentSettings.training_examples.splice(index, 1);
        renderExamples();
    }
};

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- Event Listeners ---

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-bubble chat-bubble self-start text-gray-400 italic';
    loadingDiv.innerText = 'Thinking...';
    chatLog.appendChild(loadingDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

    const response = await sendChatMessage(text);

    chatLog.removeChild(loadingDiv);
    appendMessage('ai', response);
});

saveSettingsBtn.addEventListener('click', saveSettings);

resetChatBtn.addEventListener('click', () => {
    chatLog.innerHTML = `<div class="ai-bubble chat-bubble self-start">Chat reset. Ready for new inputs.</div>`;
});

// Start
init();
