const Admin = require("../models/Admin");
const Request = require("../models/Request");
const Inventory = require("../models/Inventory");

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

    if (admin.role !== "manager") {
      return res.status(403).json({ error: "Access restricted to managers" });
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

const assignRequest = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { requestId, technicianId } = req.body;
    if (!requestId || !technicianId) {
      return res
        .status(400)
        .json({ error: "requestId and technicianId are required" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const technician = await Admin.findById(technicianId);
    if (!technician || technician.role !== "technician") {
      return res
        .status(404)
        .json({ error: "Technician not found or invalid role" });
    }

    request.assignedTo = technicianId;
    request.assignedAt = new Date();
    request.status = "in-process";
    await request.save();

    technician.assignedTasks.push(requestId);
    await technician.save();

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        assignedTo: request.assignedTo,
        assignedAt: request.assignedAt,
        status: request.status,
      },
    });
  } catch (err) {
    console.error("❌ assignRequest error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const refreshAccessToken = async (req, res) => {
  // Bu funksiya autentifikatsiya bilan ishlaydi, shuning uchun dummy sifatida qoldiramiz
  res
    .status(200)
    .json({ success: true, message: "Access token refreshed (dummy)" });
};

const allInventory = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const inventories = await Inventory.find().select(
      "name partNumber quantity description updatedAt"
    );

    res.status(200).json({
      success: true,
      data: inventories.map((inv) => ({
        id: inv._id,
        name: inv.name,
        partNumber: inv.partNumber,
        quantity: inv.quantity,
        description: inv.description,
        updatedAt: inv.updatedAt,
      })),
    });
  } catch (err) {
    console.error("❌ allInventory error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addInventory = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { name, partNumber, quantity, description } = req.body;
    if (!name || quantity < 0) {
      return res
        .status(400)
        .json({ error: "name and valid quantity are required" });
    }

    const newInventory = new Inventory({
      name,
      partNumber,
      quantity,
      description,
      updatedAt: new Date(),
    });

    await newInventory.save();

    res.status(201).json({
      success: true,
      data: {
        id: newInventory._id,
        name: newInventory.name,
        partNumber: newInventory.partNumber,
        quantity: newInventory.quantity,
        description: newInventory.description,
        updatedAt: newInventory.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ addInventory error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateInventory = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { inventoryId, name, partNumber, quantity, description } = req.body;
    if (!inventoryId || !name || quantity < 0) {
      return res
        .status(400)
        .json({ error: "inventoryId, name, and valid quantity are required" });
    }

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    inventory.name = name;
    inventory.partNumber = partNumber || inventory.partNumber;
    inventory.quantity = quantity;
    inventory.description = description || inventory.description;
    inventory.updatedAt = new Date();

    await inventory.save();

    res.status(200).json({
      success: true,
      data: {
        id: inventory._id,
        name: inventory.name,
        partNumber: inventory.partNumber,
        quantity: inventory.quantity,
        description: inventory.description,
        updatedAt: inventory.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ updateInventory error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteInventory = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { inventoryId } = req.body;
    if (!inventoryId) {
      return res.status(400).json({ error: "inventoryId is required" });
    }

    const inventory = await Inventory.findByIdAndDelete(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    res.status(200).json({
      success: true,
      message: `Inventory ${inventoryId} deleted successfully`,
    });
  } catch (err) {
    console.error("❌ deleteInventory error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const myRequests = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const requests = await Request.find()
      .populate("user", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email") // optional: ko‘rsatish uchun
      .select(
        "type issueDescription preferredMethod status submittedAt assignedAt completedAt usedInventories assignedTo"
      );

    console.log(requests);

    res.status(200).json({
      success: true,
      data: requests.map((req) => ({
        id: req._id,
        user: req.user
          ? {
              id: req.user._id,
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              email: req.user.email,
            }
          : null,
        type: req.type,
        issueDescription: req.issueDescription,
        preferredMethod: req.preferredMethod,
        status: req.status,
        submittedAt: req.submittedAt,
        assignedAt: req.assignedAt,
        completedAt: req.completedAt,
        assignedTo: req.assignedTo
          ? {
              id: req.assignedTo._id,
              firstName: req.assignedTo.firstName,
              lastName: req.assignedTo.lastName,
              email: req.assignedTo.email,
            }
          : null,
        usedInventories: req.usedInventories,
      }))
    });
  } catch (err) {
    console.error("❌ myRequests error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  about,
  assignRequest,
  refreshAccessToken,
  allInventory,
  addInventory,
  updateInventory,
  deleteInventory,
  myRequests,
};
