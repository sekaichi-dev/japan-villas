// Language Dropdown Functions

window.toggleLangDropdown = function (event) {
    event.stopPropagation();
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.classList.toggle('open');
};

window.selectLanguage = function (lang) {
    // Close dropdown
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.classList.remove('open');

    // Update display
    const display = document.getElementById('current-lang-display');
    display.textContent = lang.toUpperCase();

    // Call existing toggle function
    window.toggleLanguage(lang);
};

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.lang-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
    }
});

// Initialize current language display on page load
document.addEventListener('DOMContentLoaded', function () {
    const currentLang = window.currentLang || localStorage.getItem('siteLang') || 'en';
    const display = document.getElementById('current-lang-display');
    if (display) {
        display.textContent = currentLang.toUpperCase();
    }
});
