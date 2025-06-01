// KnowledgeArticle.js
const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  knowledge: { type: mongoose.Schema.Types.ObjectId, ref: 'Knowledge', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // markdown format
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
