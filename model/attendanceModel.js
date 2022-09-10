const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    employee_id: "String",
    employee_name: "String",
    date: "String",
    check_in: "String",
    check_out: "String",
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", schema);

module.exports = Attendance;
