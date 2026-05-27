const app = require('./src/app');
const connectDB = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5002;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Person 3 server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });