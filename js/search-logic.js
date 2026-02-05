
// --- SEARCH MODAL LOGIC ---
// --- SEARCH MODAL LOGIC ---
window.initSearchInputs = () => {
    // 1. Date Picker
    const dateEl = document.getElementById('search-dates');
    if (dateEl && window.flatpickr) {
        flatpickr(dateEl, {
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            disableMobile: "true",
            locale: {
                rangeSeparator: " ~ "
            },
            onChange: (selectedDates, dateStr, instance) => {
                if (selectedDates.length > 0) {
                    dateEl.innerText = dateStr;
                    dateEl.style.color = "#fff";
                } else {
                    dateEl.innerText = window.translations[window.currentLang || 'en']['search.dates.val'] || "Add dates";
                    dateEl.style.color = "#ccc";
                }
            }
        });
    }

    // 2. Autocomplete
    window.initSearchAutocomplete();
};

window.initSearchAutocomplete = () => {
    const input = document.querySelector('#search-modal .search-input');
    if (!input) return;

    // Create suggestions container
    let suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    input.parentNode.style.position = 'relative'; // Ensure parent is relative
    input.parentNode.appendChild(suggestionsBox);

    const renderSuggestions = (query) => {
        suggestionsBox.innerHTML = '';
        const lowerQuery = query.toLowerCase().trim();

        // Get properties
        const props = window.properties || []; // Ensure properties are loaded
        const lang = window.currentLang || 'en';

        // Filter properties (show all if empty)
        const matches = lowerQuery.length === 0
            ? props
            : props.filter(p => {
                const name = (p.name || '').toLowerCase();
                const location = (p.location || '').toLowerCase();
                const name_jp = (p.name_jp || '').toLowerCase();
                const location_jp = (p.location_jp || '').toLowerCase();

                return name.includes(lowerQuery) || location.includes(lowerQuery) ||
                    name_jp.includes(lowerQuery) || location_jp.includes(lowerQuery);
            });

        if (matches.length > 0) {
            suggestionsBox.style.display = 'block';
            matches.forEach(p => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';

                // Display text based on lang
                const title = lang === 'jp' ? p.name_jp : p.name;
                const location = lang === 'jp' ? p.location_jp : p.location;

                // Guidebook-style formatting: Title + Location context
                div.innerHTML = `
                    <div class="suggestion-content">
                        <div class="suggestion-title">${title}</div>
                        <div class="suggestion-subtitle">${location}</div>
                    </div>
                `;

                div.addEventListener('click', () => {
                    input.value = title;
                    suggestionsBox.style.display = 'none';
                });

                suggestionsBox.appendChild(div);
            });
        } else {
            suggestionsBox.style.display = 'none';
        }
    };

    // Event Listeners
    input.addEventListener('input', (e) => renderSuggestions(e.target.value));

    input.addEventListener('focus', (e) => {
        renderSuggestions(e.target.value);
    });

    // ... inside initSearchAutocomplete ...

    // Helper to perform search
    const performSearch = () => {
        const query = input.value.trim();
        const dateRange = document.getElementById('search-dates').innerText;
        const guests = document.getElementById('search-guests').value;

        if (!query && dateRange === "Add dates" && !guests) return; // Do nothing if empty

        const props = window.properties || [];
        const lowerQuery = query.toLowerCase();

        // 1. Check for Exact Match
        const exactMatch = props.find(p =>
            p.name.toLowerCase() === lowerQuery ||
            (p.name_jp && p.name_jp.toLowerCase() === lowerQuery)
        );

        if (exactMatch) {
            window.location.href = `property.html?id=${exactMatch.id}`;
        } else {
            // 2. Redirect to Stays with params
            const params = new URLSearchParams();
            if (query) params.append('q', query);

            // Parse dates only if valid (not default text)
            if (dateRange && dateRange !== "Add dates" && !dateRange.includes("dates")) {
                params.append('dates', dateRange);
            }

            if (guests) params.append('guests', guests);

            window.location.href = `stays.html?${params.toString()}`;
        }
    };

    // Trigger on Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
            suggestionsBox.style.display = 'none';
        }
    });

    // Trigger on Submit Button (if exists in modal)
    const submitBtn = document.querySelector('.btn-search-submit');
    if (submitBtn) {
        // Clone to remove old listeners
        const newBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        newBtn.addEventListener('click', performSearch);
    }
};


// Initialize immediately if DOM is ready, or add to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSearchInputs);
} else {
    window.initSearchInputs();
}
