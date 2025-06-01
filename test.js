const connectDB = require('./src/config/db');
require('./src/models/User');     // <--- MUHIM: User modelini ro'yxatdan o'tkazish
require('./src/models/Admin');    // <--- Agar assignedTo: Admin bo'lsa, bu ham kerak bo'ladi
const Request = require('./src/models/Request');

const run = async () => {
  try {
    const requests = await Request.find()
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .select('-__v');

    if (!requests.length) {
      console.log('❗ No requests found in the database.');
      return;
    }

    console.log(`✅ Found ${requests.length} requests:\n`);
    for (const r of requests) {
      console.log({
        id: r._id,
        user: r.user ? {
          name: `${r.user.firstName} ${r.user.lastName}`,
          email: r.user.email
        } : null,
        type: r.type,
        issue: r.issueDescription,
        preferredMethod: r.preferredMethod,
        status: r.status,
        assignedTo: r.assignedTo ? {
          name: `${r.assignedTo.firstName} ${r.assignedTo.lastName}`,
          email: r.assignedTo.email
        } : null,
        submittedAt: r.submittedAt,
        assignedAt: r.assignedAt,
        completedAt: r.completedAt,
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error fetching requests:', err);
    process.exit(1);
  }
};

connectDB(run);
