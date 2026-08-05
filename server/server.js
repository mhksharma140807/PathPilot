const dns = require('dns')
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();