const express = require('express');
const {
	getArticles,
	getArticleByName,
	uploadArticleImage,
	createArticle,
	updateArticle,
	deleteArticle,
} = require('../controllers/articleController');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.route('/').get(getArticles).post(createArticle);
router.post('/upload', upload.single('image'), uploadArticleImage);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.get('/:name', getArticleByName);

module.exports = router;
