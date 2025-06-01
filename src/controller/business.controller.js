const User = require('../models/User');

const aboutMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const user = await User.findById(req.user.id).select('email role _id');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('❌ aboutMe error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const editProfile = (req, res) => {
  res.status(200).send({ message: 'Hello Edit Profile!' });
};

const refreshAccessToken = (req, res) => {
  res.status(200).send({ message: 'Hello Refresh Access Token!' });
};

const sendSupportRequest = (req, res) => {
  res.status(200).send({ message: 'Hello Send Support Request!' });
};

const getSupportRequests = (req, res) => {
  res.status(200).send({ message: 'Hello Get Support Requests!' });
};

module.exports = {
    aboutMe,
    editProfile,
    refreshAccessToken,
    sendSupportRequest,
    getSupportRequests
};
