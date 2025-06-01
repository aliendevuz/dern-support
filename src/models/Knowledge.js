const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  similars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeArticle', default: [] }], // 3 ta o'xshash maqola ID'lari
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Knowledge', knowledgeSchema);