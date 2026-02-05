
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

    // 2. Autocomplete - Main Search
    window.initSearchAutocomplete('.search-modal .search-input');

    // 3. Header Search
    window.initHeaderSearch();
};

// Refactored to be reusable - can target any input selector
window.initSearchAutocomplete = (selectorOrElement) => {
    let input;
    if (typeof selectorOrElement === 'string') {
        input = document.querySelector(selectorOrElement);
    } else {
        input = selectorOrElement;
    }

    if (!input) return;

    // Create suggestions container if not exists (checked by class or ID)
    // For header search, container exists in HTML. For modal, we create it dynamically if needed.
    let suggestionsBox;

    // Check if it's header search
    if (input.classList.contains('header-search-input')) {
        suggestionsBox = input.closest('.header-search-container').querySelector('.header-search-suggestions');
    } else {
        // Modal search logic (dynamic creation)
        if (input.parentNode.querySelector('.search-suggestions')) {
            suggestionsBox = input.parentNode.querySelector('.search-suggestions');
        } else {
            suggestionsBox = document.createElement('div');
            suggestionsBox.className = 'search-suggestions';
            input.parentNode.style.position = 'relative';
            input.parentNode.appendChild(suggestionsBox);
        }
    }

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

                // Guidebook-style formatting
                div.innerHTML = `
                    <div class="suggestion-content">
                        <div class="suggestion-title">${title}</div>
                        <div class="suggestion-subtitle">${location}</div>
                    </div>
                `;

                div.addEventListener('click', () => {
                    input.value = title;
                    suggestionsBox.style.display = 'none';
                    // Optional: Auto-search on click
                    window.location.href = `property.html?id=${p.id}`;
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

    // Close suggestions on blur (delayed to allow click)
    input.addEventListener('blur', () => {
        setTimeout(() => {
            suggestionsBox.style.display = 'none';
        }, 200);
    });

    // Helper to perform search
    const performSearch = () => {
        const query = input.value.trim();

        // Context specific params
        let dateRange = "Add dates";
        let guests = "";

        // Only grab these if we are in the main modal
        if (!input.classList.contains('header-search-input')) {
            const dEl = document.getElementById('search-dates');
            if (dEl) dateRange = dEl.innerText;
            const gEl = document.getElementById('search-guests');
            if (gEl) guests = gEl.value;
        }

        if (!query && dateRange === "Add dates" && !guests) return;

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

    // Main modal submit button logic remains separate or can be attached here if needed
    if (!input.classList.contains('header-search-input')) {
        const submitBtn = document.querySelector('.btn-search-submit');
        if (submitBtn) {
            const newBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newBtn, submitBtn);
            newBtn.addEventListener('click', performSearch);
        }
    }
};

window.initHeaderSearch = () => {
    const headerInput = document.querySelector('.header-search-input');
    if (headerInput) {
        window.initSearchAutocomplete(headerInput);

        // Add scroll observer
        // Add scroll observer
        // Observe the HERO SEARCH BAR, not the hero background
        const heroSearch = document.querySelector('.hero-search-container');

        if (heroSearch) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // console.log('Observer:', entry.isIntersecting, entry.boundingClientRect.top);

                    // Simple logic: if not intersecting and we've scrolled past it (top is negative)
                    if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                        document.body.classList.add('show-header-search');
                    } else if (entry.isIntersecting) {
                        document.body.classList.remove('show-header-search');
                    }
                });
            }, {
                root: null,
                threshold: 0,
                rootMargin: "0px"
            });

            observer.observe(heroSearch);
        }
    }
};

// Initialize immediately if DOM is ready, or add to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initSearchInputs);
} else {
    window.initSearchInputs();
}
