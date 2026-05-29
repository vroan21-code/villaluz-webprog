const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = process.env.VERCEL
	? path.join('/tmp', 'uploads')
	: path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: uploadsDir,
	filename: (req, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
	},
});

const imageFilter = (req, file, cb) => {
	const allowed = /\.(jpe?g|png|gif|webp)$/i;
	if (allowed.test(file.originalname) && file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
	}
};

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: imageFilter,
});

module.exports = { upload, uploadsDir };
