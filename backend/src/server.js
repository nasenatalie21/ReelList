const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on ${PORT}`)))
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
