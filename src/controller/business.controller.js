const User = require('../models/User');
const Request = require('../models/Request');

const aboutMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const user = await User.findById(req.user.id).select('email role _id firstName lastName phone address companyName employeeCount');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      companyName: user.companyName || null,
      employeeCount: user.employeeCount || null,
    });
  } catch (err) {
    console.error('❌ aboutMe error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const editProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { firstName, lastName, phone, address, companyName, employeeCount } = req.body;
    const updates = {
      firstName,
      lastName,
      phone,
      address,
      ...(req.body.role === 'business' && { companyName, employeeCount }),
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('email role firstName lastName phone address companyName employeeCount');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        companyName: user.companyName || null,
        employeeCount: user.employeeCount || null,
      },
    });
  } catch (err) {
    console.error('❌ editProfile error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const refreshAccessToken = async (req, res) => {
  // Bu funksiya autentifikatsiya bilan ishlaydi, shuning uchun dummy sifatida qoldiramiz
  res.status(200).json({ success: true, message: 'Access token refreshed (dummy)' });
};

const sendSupportRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { issueDescription } = req.body;
    if (!issueDescription) {
      return res.status(400).json({ error: 'issueDescription is required' });
    }

    const newRequest = new Request({
      user: req.user.id,
      type: req.user.role, // individual yoki business
      issueDescription,
      preferredMethod: 'on-site',
      status: 'pending',
      submittedAt: new Date(),
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      data: {
        id: newRequest._id,
        user: newRequest.user,
        type: newRequest.type,
        issueDescription: newRequest.issueDescription,
        preferredMethod: newRequest.preferredMethod,
        status: newRequest.status,
        submittedAt: newRequest.submittedAt,
      },
    });
  } catch (err) {
    console.error('❌ sendSupportRequest error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSupportRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const requests = await Request.find({ user: req.user.id }).select(
      'type issueDescription preferredMethod status submittedAt assignedAt completedAt'
    );

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error('❌ getSupportRequests error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  aboutMe,
  editProfile,
  refreshAccessToken,
  sendSupportRequest,
  getSupportRequests,
};