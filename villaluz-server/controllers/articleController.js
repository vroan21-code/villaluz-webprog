const fs = require('fs');
const path = require('path');
const Article = require('../models/Article');
const { uploadsDir } = require('../middleware/upload');

const removeUploadFile = (imagePath) => {
	if (imagePath?.startsWith('/uploads/')) {
		const filePath = path.join(uploadsDir, path.basename(imagePath));
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}
};

const getArticles = async (req, res) => {
	try {
		const articles = await Article.find().sort({ createdAt: -1 });
		res.json({ articles });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getArticleByName = async (req, res) => {
	try {
		const article = await Article.findOne({ name: req.params.name });
		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}
		res.json(article);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const uploadArticleImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No image file provided' });
		}
		res.status(201).json({ url: `/uploads/${req.file.filename}` });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createArticle = async (req, res) => {
	try {
		const { name, title, image, content } = req.body;

		if (!name?.trim() || !title?.trim() || !image?.trim()) {
			return res.status(400).json({ message: 'Name, title, and image are required' });
		}

		if (!Array.isArray(content) || content.length === 0) {
			return res.status(400).json({ message: 'At least one content paragraph is required' });
		}

		const article = await Article.create({
			name: name.trim(),
			title: title.trim(),
			image: image.trim(),
			content: content.map((p) => String(p).trim()).filter(Boolean),
		});

		res.status(201).json(article);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteArticle = async (req, res) => {
	try {
		const article = await Article.findByIdAndDelete(req.params.id);
		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		removeUploadFile(article.image);

		res.json({ message: 'Article deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		if (!article) {
			return res.status(404).json({ message: 'Article not found' });
		}

		const { name, title, image, content } = req.body;

		if (!name?.trim() || !title?.trim() || !image?.trim()) {
			return res.status(400).json({ message: 'Name, title, and image are required' });
		}

		if (!Array.isArray(content) || content.length === 0) {
			return res.status(400).json({ message: 'At least one content paragraph is required' });
		}

		const oldImage = article.image;

		article.name = name.trim();
		article.title = title.trim();
		article.image = image.trim();
		article.content = content.map((p) => String(p).trim()).filter(Boolean);

		await article.save();

		if (oldImage !== article.image) {
			removeUploadFile(oldImage);
		}

		res.json(article);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getArticles,
	getArticleByName,
	uploadArticleImage,
	createArticle,
	updateArticle,
	deleteArticle,
};
