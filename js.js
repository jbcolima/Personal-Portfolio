// Dark mode toggle
document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = '🌙';
        themeToggle.onclick = function () {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        };
    }

    // Edit About Section
    const editBtn = document.getElementById('edit-about-btn');
    const aboutContent = document.getElementById('about-content');
    let editing = false;

    if (editBtn && aboutContent) {
        editBtn.onclick = function () {
            editing = !editing;
            if (editing) {
                aboutContent.setAttribute('contenteditable', 'true');
                aboutContent.style.border = '2px dashed var(--primary-theme-color)';
                editBtn.textContent = 'Save';
            } else {
                aboutContent.removeAttribute('contenteditable');
                aboutContent.style.border = 'none';
                editBtn.textContent = 'Edit';
            }
        };
    }
});