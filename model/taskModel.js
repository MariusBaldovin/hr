const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    task_name: "String",
    deadline: "String",
    status: "String",
    employee_id: "String",
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", schema);

module.exports = Task;
