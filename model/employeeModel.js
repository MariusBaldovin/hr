const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    first_name: "String",
    last_name: "String",
    email: "String",
    contact: "Number",
    role: "String",
    password: "String",
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", schema);

module.exports = Employee;
