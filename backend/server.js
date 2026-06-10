require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from environment variables');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
  console.log('Server ReadyState:', mongoose.connection.readyState);
};

const startServer = async () => {
  await connectDatabase();

  return app.listen(PORT, () => {
    console.log(`BrainMint backend running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
}

module.exports = { app, connectDatabase, startServer };
