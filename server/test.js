const mongoose = require("mongoose");

const uri = "mongodb+srv://pathpilot_app:******@pathpilot-cluster.zic6yzq.mongodb.net/?appName=pathpilot-cluster";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });