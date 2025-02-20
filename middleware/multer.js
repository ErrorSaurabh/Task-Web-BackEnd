const multer = require('multer');
const path = require('path');

// Multer configuration (simplified)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Store files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
