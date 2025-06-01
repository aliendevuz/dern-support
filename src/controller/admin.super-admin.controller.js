const Admin = require("../models/Admin");
const Knowledge = require("../models/Knowledge");
const Inventory = require("../models/Inventory");
const KnowledgeArticle = require("../models/KnowledgeArticle");
const Request = require("../models/Request");
const bcrypt = require("bcrypt");

const aboutMe = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const admin = await Admin.findById(req.admin.id).select(
      "email role _id firstName lastName"
    );
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (err) {
    console.error("❌ aboutMe error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addAdmin = async (req, res) => {
  const { role, firstName, lastName, email, password, pinCode } = req.body;

  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const pinCodeHash = await bcrypt.hash(pinCode, 12);

    if (!["super-admin", "manager", "technician"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newAdmin = new Admin({
      role,
      firstName,
      lastName,
      email,
      password: passwordHash,
      pinCode: pinCodeHash,
    });

    await newAdmin.save();

    return res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
      },
    });
  } catch (err) {
    console.error("❌ addAdmin error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const allAdmin = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const admins = await Admin.find().select(
      "email role firstName lastName kpi assignedTasks"
    );

    res.status(200).json({
      success: true,
      data: admins.map((admin) => ({
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
        kpi: admin.kpi,
        assignedTasks: admin.assignedTasks,
      })),
    });
  } catch (err) {
    console.error("❌ allAdmin error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const about = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const admin = await Admin.findById(req.admin.id).select(
      "email role firstName lastName"
    );
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (admin.role !== "super-admin") {
      return res
        .status(403)
        .json({ error: "Access restricted to super-admins" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (err) {
    console.error("❌ about error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { adminId, role, firstName, lastName, email, password, pinCode } =
      req.body;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (role && !["super-admin", "manager", "technician"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    admin.role = role || admin.role;
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;
    if (password) {
      admin.password = await bcrypt.hash(password, 12);
    }
    if (pinCode) {
      admin.pinCode = await bcrypt.hash(pinCode, 12);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (err) {
    console.error("❌ updateAdmin error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    if (adminId === req.admin.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: `Admin ${adminId} deleted successfully`,
    });
  } catch (err) {
    console.error("❌ deleteAdmin error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const refreshAccessToken = async (req, res) => {
  // Bu funksiya autentifikatsiya bilan ishlaydi, shuning uchun dummy sifatida qoldiramiz
  res
    .status(200)
    .json({ success: true, message: "Access token refreshed (dummy)" });
};

const allKnowledge = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const knowledges = await Knowledge.find().select(
      "title category description createdAt similars"
    );

    res.status(200).json({
      success: true,
      data: knowledges.map((k) => ({
        id: k._id,
        title: k.title,
        category: k.category,
        description: k.description,
        createdAt: k.createdAt,
        similars: k.similars,
      })),
    });
  } catch (err) {
    console.error("❌ allKnowledge error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addKnowledge = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { title, category, description, articleContent, similars } = req.body;
    if (!title || !articleContent) {
      return res.status(400).json({ error: "title and articleContent are required" });
    }

    // Similars ni tekshirish va validatsiya qilish
    let similarIds = [];
    if (similars && Array.isArray(similars)) {
      // Similars ID larini tekshirish
      const validSimilars = await KnowledgeArticle.find({
        _id: { $in: similars },
      }).select("_id");
      similarIds = validSimilars.map((article) => article._id);
    }

    const knowledge = new Knowledge({
      title,
      category,
      description,
      similars: similarIds, // Similars maydonini qo‘shish
      createdAt: new Date(),
    });
    await knowledge.save();

    const knowledgeArticle = new KnowledgeArticle({
      knowledge: knowledge._id,
      title,
      content: articleContent,
      createdAt: new Date(),
    });
    await knowledgeArticle.save();

    res.status(201).json({
      success: true,
      data: {
        id: knowledge._id,
        title: knowledge.title,
        category: knowledge.category,
        description: knowledge.description,
        similars: similarIds,
        article: {
          id: knowledgeArticle._id,
          title: knowledgeArticle.title,
          content: knowledgeArticle.content,
          createdAt: knowledgeArticle.createdAt,
        },
      },
    });
  } catch (err) {
    console.error("❌ addKnowledge error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateKnowledge = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { knowledgeId, title, category, description, articleId, articleContent, similars } = req.body;
    if (!knowledgeId || !articleId) {
      return res.status(400).json({ error: "knowledgeId and articleId are required" });
    }

    const knowledge = await Knowledge.findById(knowledgeId);
    if (!knowledge) {
      return res.status(404).json({ error: "Knowledge not found" });
    }

    const article = await KnowledgeArticle.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: "Knowledge article not found" });
    }

    // Similars ni yangilash
    let similarIds = knowledge.similars;
    if (similars && Array.isArray(similars)) {
      const validSimilars = await KnowledgeArticle.find({
        _id: { $in: similars },
      }).select("_id");
      similarIds = validSimilars.map((article) => article._id);
    }

    knowledge.title = title || knowledge.title;
    knowledge.category = category || knowledge.category;
    knowledge.description = description || knowledge.description;
    knowledge.similars = similarIds; // Similars maydonini yangilash
    await knowledge.save();

    article.title = title || article.title;
    article.content = articleContent || article.content;
    await article.save();

    res.status(200).json({
      success: true,
      data: {
        id: knowledge._id,
        title: knowledge.title,
        category: knowledge.category,
        description: knowledge.description,
        similars: knowledge.similars,
        article: {
          id: article._id,
          title: article.title,
          content: article.content,
          createdAt: article.createdAt,
        },
      },
    });
  } catch (err) {
    console.error("❌ updateKnowledge error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteKnowledge = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { knowledgeId } = req.body;
    if (!knowledgeId) {
      return res.status(400).json({ error: "knowledgeId is required" });
    }

    const knowledge = await Knowledge.findByIdAndDelete(knowledgeId);
    if (!knowledge) {
      return res.status(404).json({ error: "Knowledge not found" });
    }

    await KnowledgeArticle.deleteMany({ knowledge: knowledgeId });

    res.status(200).json({
      success: true,
      message: `Knowledge ${knowledgeId} and related articles deleted successfully`,
    });
  } catch (err) {
    console.error("❌ deleteKnowledge error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const detailsKnowledge = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { articleId } = req.query;
    if (!articleId) {
      return res.status(400).json({ error: "articleId is required" });
    }

    console.log(`Fetching KnowledgeArticle for knowledge ID: ${articleId}`);
    const articles = await KnowledgeArticle.find({ knowledge: articleId })
      .populate("knowledge", "title category description")
      .select("title content createdAt");

    if (!articles || articles.length === 0) {
      console.error(`No KnowledgeArticle found for knowledgeId: ${articleId}`);
      return res.status(404).json({ error: "Knowledge article not found" });
    }

    // Massivdan birinchi elementni olish
    const article = articles[0];

    console.log("Found article:", article); // Qo‘shimcha log

    res.status(200).json({
      success: true,
      data: {
        id: article._id,
        title: article.title,
        content: article.content,
        knowledge: {
          id: article.knowledge._id,
          title: article.knowledge.title,
          category: article.knowledge.category,
          description: article.knowledge.description,
        },
        createdAt: article.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ detailsKnowledge error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const analytics = async (req, res) => {
  try {
    // if (!req.admin || !req.admin.id) {
    //   return res.status(403).json({ error: 'Unauthorized access' });
    // }

    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const inProcessRequests = await Request.countDocuments({ status: 'in-process' });
    const doneRequests = await Request.countDocuments({ status: 'done' });

    const avgPriceQuote = await Request.aggregate([
      { $match: { priceQuote: { $exists: true } } },
      { $group: { _id: null, avgPrice: { $avg: '$priceQuote' } } },
    ]);

    const technicians = await Admin.find({ role: 'technician' }).select('kpi firstName lastName');
    const totalCompleted = technicians.reduce((sum, tech) => sum + tech.kpi.totalCompleted, 0);
    const avgCompletionTime = technicians.length
      ? technicians.reduce((sum, tech) => sum + tech.kpi.avgCompletionTime, 0) / technicians.length
      : 0;

    const topTechnicians = technicians
      .sort((a, b) => b.kpi.totalCompleted - a.kpi.totalCompleted)
      .slice(0, 3)
      .map(tech => ({
        id: tech._id,
        name: `${tech.firstName} ${tech.lastName}`,
        totalCompleted: tech.kpi.totalCompleted,
      }));

    const inventoryCount = await Inventory.countDocuments();
    const lowStockInventories = await Inventory.countDocuments({ quantity: { $lt: 5 } });

    const topInventories = await Request.aggregate([
      { $unwind: '$usedInventories' },
      {
        $group: {
          _id: '$usedInventories.inventory',
          totalUsed: { $sum: '$usedInventories.quantity' },
        },
      },
      { $sort: { totalUsed: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: '_id',
          as: 'inventory',
        },
      },
      { $unwind: '$inventory' },
      {
        $project: {
          id: '$_id',
          name: '$inventory.name',
          totalUsed: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          inProcess: inProcessRequests,
          done: doneRequests,
          avgPrice: avgPriceQuote[0]?.avgPrice ? Math.round(avgPriceQuote[0].avgPrice) : 0,
        },
        technicians: {
          total: technicians.length,
          totalCompleted,
          avgCompletionTime: Math.round(avgCompletionTime),
          topTechnicians,
        },
        inventory: {
          total: inventoryCount,
          lowStock: lowStockInventories,
          topUsed: topInventories,
        },
      },
    });
  } catch (err) {
    console.error('❌ analytics error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getKpi = async (req, res) => {
  try {
    // if (!req.admin || !req.admin.id) {
    //   return res.status(403).json({ error: 'Unauthorized access' });
    // }

    const technicians = await Admin.find({ role: 'technician' }).select(
      'email firstName lastName kpi assignedTasks'
    );

    if (!technicians.length) {
      return res.status(404).json({ error: 'No technicians found' });
    }

    const kpiData = await Promise.all(
      technicians.map(async tech => {
        const recentRequests = await Request.find({ assignedTo: tech._id })
          .select('issueDescription status completedAt')
          .sort({ completedAt: -1 })
          .limit(3);

        return {
          id: tech._id,
          email: tech.email,
          name: `${tech.firstName} ${tech.lastName}`,
          kpi: {
            totalCompleted: tech.kpi.totalCompleted,
            avgCompletionTime: tech.kpi.avgCompletionTime.toFixed(2),
          },
          assignedTasksCount: tech.assignedTasks.length,
          recentRequests: recentRequests.map(req => ({
            id: req._id,
            issueDescription: req.issueDescription,
            status: req.status,
            completedAt: req.completedAt,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: kpiData,
    });
  } catch (err) {
    console.error('❌ getKpi error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  aboutMe,
  addAdmin,
  allAdmin,
  about,
  updateAdmin,
  deleteAdmin,
  refreshAccessToken,
  allKnowledge,
  addKnowledge,
  updateKnowledge,
  deleteKnowledge,
  detailsKnowledge,
  analytics,
  getKpi,
};
