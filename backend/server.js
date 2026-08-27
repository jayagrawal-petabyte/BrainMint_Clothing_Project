require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch(_) {}
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
  const server = startServer().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

  // Production Error Handling
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });
}

module.exports = { app, connectDatabase, startServer };
