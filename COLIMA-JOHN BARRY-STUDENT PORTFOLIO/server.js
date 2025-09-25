const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// public folder (frontend files) - ensure you move index.html, css.css, js.js and img/ into ./public
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// serve static frontend + uploaded images
app.use(express.static(PUBLIC_DIR));

// multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // keep original name with timestamp to avoid collisions
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
        cb(null, base + '-' + Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    // after upload redirect back to homepage
    res.redirect('/');
});

// endpoint to list uploaded images (returns JSON array of filenames)
app.get('/uploads/list', (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) return res.json([]);
        // filter image files
        const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
        // sort by newest first
        images.sort((a, b) => fs.statSync(path.join(UPLOADS_DIR, b)).mtimeMs - fs.statSync(path.join(UPLOADS_DIR, a)).mtimeMs);
        res.json(images);
    });
});

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});