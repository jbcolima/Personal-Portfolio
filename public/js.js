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

    // Upload preview + drag/drop UI
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('image-input');
    const previewImg = document.getElementById('preview-img');
    const fileNameEl = document.getElementById('file-name');
    const clearBtn = document.getElementById('clear-btn');
    const uploadForm = document.getElementById('upload-form');

    function showPreview(file) {
        if (!file) {
            previewImg.src = '/img/jbcolimafront.png';
            fileNameEl.textContent = '';
            return;
        }
        fileNameEl.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // click on dropzone opens file dialog
    if (dropzone) {
        dropzone.addEventListener('click', () => fileInput.click());

        // drag events
        ['dragenter', 'dragover'].forEach(evt =>
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dragover');
            })
        );
        ['dragleave', 'drop'].forEach(evt =>
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            })
        );

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (!dt) return;
            const file = dt.files[0];
            if (file) {
                // set file input files using DataTransfer if supported
                try {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                } catch (err) {
                    // fallback: cannot programmatically set files in some browsers
                }
                showPreview(file);
            }
        });
    }

    // file input change
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            showPreview(f);
        });
    }

    // clear selection
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // clear input
            fileInput.value = '';
            showPreview(null);
        });
    }

    // optional: simple client-side validation before submit
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            const f = fileInput.files && fileInput.files[0];
            if (!f) {
                e.preventDefault();
                alert('Please choose an image to upload.');
                return;
            }
            if (f.size > 10 * 1024 * 1024) { // 10MB limit
                e.preventDefault();
                alert('File too large. Max 10MB.');
            }
        });
    }

    // load latest uploaded image and set as profile photo if present
    fetch('/uploads/list')
        .then(r => r.json())
        .then(files => {
            if (files && files.length > 0) {
                // first (newest) uploaded file
                const newest = files[0];
                const imgEl = document.getElementById('profile-photo');
                if (imgEl) {
                    imgEl.src = '/uploads/' + encodeURIComponent(newest);
                }
            }
        })
        .catch(() => { /* ignore */ });
});