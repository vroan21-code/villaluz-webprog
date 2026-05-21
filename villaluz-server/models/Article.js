const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		image: { type: String, required: true },
		content: { type: [String], required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);
