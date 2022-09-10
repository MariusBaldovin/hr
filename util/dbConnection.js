const mongoose = require("mongoose");
const DB =
  "mongodb+srv://TestRoot:testroot@cluster0.vgbsafk.mongodb.net/hr_management?retryWrites=true&w=majority";

const getDbConnection = mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connection Established.");
  })
  .catch((e) => console.log(e));

module.exports = getDbConnection;
