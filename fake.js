const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// .env faylidan MONGO_URI o'qish
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://username:password@cluster0.mongodb.net/it_service_db?retryWrites=true&w=majority';

// MongoDB sxemalari
const adminSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  password: String,
  role: String,
  status: String,
  createdAt: Date,
});

const requestSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  status: String,
  createdAt: Date,
  completedAt: Date,
  technicianId: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
});

const inventorySchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  status: String,
  createdAt: Date,
});

const knowledgeSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  createdAt: Date,
  similars: [String],
});

const knowledgeArticleSchema = new mongoose.Schema({
  knowledge: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  createdAt: Date,
});

const Admin = mongoose.model('Admin', adminSchema);
const Request = mongoose.model('Request', requestSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Knowledge = mongoose.model('Knowledge', knowledgeSchema);
const KnowledgeArticle = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);

// Tasodifiy sana yaratish
const randomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// Parolni hash qilish
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Soxta adminlar yaratish
const generateAdmins = async (count = 50) => {
  const admins = [];
  const roles = ['super-admin', 'manager', 'technician'];
  for (let i = 0; i < count; i++) {
    admins.push({
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
      password: await hashPassword('password123'),
      role: roles[Math.floor(Math.random() * roles.length)],
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      createdAt: randomDate(365),
    });
  }
  await Admin.insertMany(admins);
  console.log(`${count} admins created.`);
};

// Soxta so'rovlar yaratish
const generateRequests = async (count = 200, technicianIds) => {
  const requests = [];
  const categories = ['kompyuter', 'printer', 'tarmoq', 'dasturiy ta\'minot', 'boshqa'];
  const statuses = ['open', 'in-progress', 'completed'];
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = randomDate(90);
    const completedAt = status === 'completed' ? new Date(createdAt.getTime() + Math.random() * 72 * 60 * 60 * 1000) : null;
    requests.push({
      title: faker.lorem.sentence(5),
      category: categories[Math.floor(Math.random() * categories.length)],
      description: faker.lorem.paragraph(),
      status,
      createdAt,
      completedAt,
      technicianId: status !== 'open' && technicianIds.length ? technicianIds[Math.floor(Math.random() * technicianIds.length)] : null,
      createdBy: new mongoose.Types.ObjectId(),
    });
  }
  await Request.insertMany(requests);
  console.log(`${count} requests created.`);
};

// Soxta inventar yaratish
const generateInventory = async (count = 100) => {
  const inventories = [];
  const categories = ['kompyuter qismlari', 'printer sarflari', 'tarmoq uskunalari', 'boshqa'];
  for (let i = 0; i < count; i++) {
    inventories.push({
      name: `${faker.lorem.word().charAt(0).toUpperCase() + faker.lorem.word().slice(1)} ${['qism', 'uskuna', 'sarf'][Math.floor(Math.random() * 3)]}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 100) + 1,
      status: Math.random() > 0.5 ? 'available' : 'used',
      createdAt: randomDate(365),
    });
  }
  await Inventory.insertMany(inventories);
  console.log(`${count} inventories created.`);
};

// Soxta knowledge va knowledge articles yaratish
const generateKnowledgeAndArticles = async (count = 30) => {
  const knowledges = [];
  const articles = [];
  const categories = ['kompyuter', 'printer', 'tarmoq', 'dasturiy ta\'minot'];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence(4);
    const knowledgeId = new mongoose.Types.ObjectId();
    knowledges.push({
      _id: knowledgeId,
      title,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: faker.lorem.paragraph(),
      createdAt: randomDate(365),
      similars: [],
    });
    articles.push({
      knowledge: knowledgeId,
      title,
      content: `# ${title}\n\n${faker.lorem.paragraph()}\n\n## Qo'llanma\n\n* ${faker.lorem.sentence()}\n* ${faker.lorem.sentence()}\n\n![Rasm](https://picsum.photos/200/300)`,
      createdAt: randomDate(365),
    });
  }
  await Knowledge.insertMany(knowledges);
  await KnowledgeArticle.insertMany(articles);
  console.log(`${count} knowledges and articles created.`);
};

// Asosiy funksiya
const main = async () => {
  try {
    // MongoDB'ga ulanish
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');

    // Jadvallarni tozalash (ixtiyoriy, ehtiyot bo'ling!)
    // await Admin.deleteMany({});
    // await Request.deleteMany({});
    // await Inventory.deleteMany({});
    // await Knowledge.deleteMany({});
    // await KnowledgeArticle.deleteMany({});
    // console.log('All collections cleared.');

    // Adminlarni yaratish
    await generateAdmins(50);

    // Technician ID'larini olish
    const technicians = await Admin.find({ role: 'technician' }).select('_id');
    const technicianIds = technicians.map(t => t._id);

    // So'rovlar, inventar va knowledge'larni yaratish
    await generateRequests(200, technicianIds);
    await generateInventory(100);
    await generateKnowledgeAndArticles(30);

    console.log('Fake data generation completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Skriptni ishga tushirish
main();