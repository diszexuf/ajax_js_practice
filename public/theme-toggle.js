$(document).ready(function () {
    var root = document.documentElement;
    var currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        setDarkTheme(root);
    } else {
        setLightTheme(root);
    }

    $('#theme-toggle').on('click', function () {
        toggleTheme();
    });
});

function setLightTheme(root) {
    root.style.setProperty('--posts-container-bg-color', '#ffffff');
    root.style.setProperty('--post-border-color', '#cccccc');
    root.style.setProperty('--post-font-color', '#000000');
    root.style.setProperty('--header-footer-bg-color', '#b62ee7');
    root.style.setProperty('--modal-forms-bg-color', '#ffffff');
}

function setDarkTheme(root) {
    root.style.setProperty('--posts-container-bg-color', '#33333b');
    root.style.setProperty('--post-border-color', '#f1f1f1');
    root.style.setProperty('--post-font-color', '#ffffff');
    root.style.setProperty('--header-footer-bg-color', '#9f28cc');
    root.style.setProperty('--modal-forms-bg-color', '#3e3e48');
}

function toggleTheme() {
    var currentTheme = localStorage.getItem('theme') || 'light';
    var root = document.documentElement;
    var newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    // Вызываем функции установки темы после установки новой темы
    if (newTheme === 'dark') {
        setDarkTheme(root);
    } else {
        setLightTheme(root);
    }
}