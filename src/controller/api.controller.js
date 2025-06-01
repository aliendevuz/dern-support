const Knowledge = require("../models/Knowledge");
const KnowledgeArticle = require("../models/KnowledgeArticle");

// Ma'lumotlarni formatlash uchun yordamchi funksiya
const formatArticle = (article) => ({
  id: article._id,
  title: article.title || "Nomsiz maqola",
  content: article.content || "",
  knowledge: article.knowledge
    ? {
        id: article.knowledge._id,
        title: article.knowledge.title || "Nomsiz",
        category: article.knowledge.category || "Kategoriya yo'q",
        ...(article.knowledge.description && { description: article.knowledge.description }),
      }
    : {
        id: "",
        title: "Nomsiz",
        category: "Kategoriya yo'q",
      },
  createdAt: article.createdAt || new Date(),
});

// Umumiy xato javobi funksiyasi
const sendError = (res, status, message) => {
  console.error(`❌ Error: ${message}`);
  return res.status(status).json({ success: false, error: message });
};

const random = async (req, res) => {
  try {
    const count = await KnowledgeArticle.countDocuments();
    if (count === 0) {
      return sendError(res, 404, "Hech qanday maqola topilmadi");
    }

    const randomIndexes = [];
    const maxSelections = Math.min(3, count);
    while (randomIndexes.length < maxSelections) {
      const randomIndex = Math.floor(Math.random() * count);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const articles = await KnowledgeArticle.find()
      .skip(randomIndexes[0])
      .limit(maxSelections)
      .populate("knowledge", "title category")
      .select("title content createdAt");

    return res.status(200).json({
      success: true,
      data: articles.map(formatArticle),
    });
  } catch (err) {
    return sendError(res, 500, "Server xatosi yuz berdi");
  }
};

const similar = async (req, res) => {
  try {
    const { knowledgeId } = req.query;
    if (!knowledgeId) {
      return sendError(res, 400, "knowledgeId talab qilinadi");
    }

    const knowledge = await Knowledge.findById(knowledgeId).select("similars");
    if (!knowledge) {
      return sendError(res, 404, "Knowledge topilmadi");
    }

    const similarArticles = await KnowledgeArticle.find({
      _id: { $in: knowledge.similars },
    })
      .populate("knowledge", "title category")
      .select("title content createdAt")
      .limit(3);

    if (!similarArticles || similarArticles.length === 0) {
      return await random(req, res); // Fallback sifatida random maqolalar
    }

    return res.status(200).json({
      success: true,
      data: similarArticles.map(formatArticle),
    });
  } catch (err) {
    return sendError(res, 500, "Server xatosi yuz berdi");
  }
};

const allKnowledge = async (req, res) => {
  try {
    const articles = await KnowledgeArticle.find()
      .populate("knowledge", "title category")
      .select("title content createdAt");

    if (!articles || articles.length === 0) {
      return sendError(res, 404, "Hech qanday maqola topilmadi");
    }

    return res.status(200).json({
      success: true,
      data: articles.map(formatArticle),
    });
  } catch (err) {
    return sendError(res, 500, "Server xatosi yuz berdi");
  }
};

const detailsKnowledge = async (req, res) => {
  try {
    const { articleId } = req.query;
    if (!articleId) {
      return sendError(res, 400, "articleId talab qilinadi");
    }

    const article = await KnowledgeArticle.findById(articleId)
      .populate("knowledge", "title category description")
      .select("title content createdAt");

    if (!article) {
      return sendError(res, 404, "Maqola topilmadi");
    }

    return res.status(200).json({
      success: true,
      data: formatArticle(article),
    });
  } catch (err) {
    return sendError(res, 500, "Server xatosi yuz berdi");
  }
};

module.exports = {
  random,
  similar,
  allKnowledge,
  detailsKnowledge,
};