const express = require("express");
const app = express();
const cors = require("cors");
const getDbConnection = require("./util/dbConnection");
const employeeModel = require("./model/employeeModel");
const taskModel = require("./model/taskModel");
const attendanceModel = require("./model/attendanceModel");
const { encrypt, decrypt } = require("./util/crypto");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));

const frontendUrl = __dirname;

// frontend
app.get("/", async (req, res) => {
  res.sendFile(frontendUrl + "/frontend/index.html");
});
app.get("/signup", async (req, res) => {
  res.sendFile(frontendUrl + "/frontend/Signup.html");
});
app.get("/employee_dashboard", async (req, res) => {
  res.sendFile(frontendUrl + "/frontend/employee_dashboard.html");
});
app.get("/hr_dashboard", async (req, res) => {
  res.sendFile(frontendUrl + "/frontend/hr_dashboard.html");
});
app.get("/admin_dashboard", async (req, res) => {
  res.sendFile(frontendUrl + "/frontend/admin_dashboard.html");
});

//backend
// get all employees
app.get("/employee", async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

// add employee
app.post("/add_employee", async (req, res) => {
  const { first_name, last_name, email, contact, password } = req.body;
  const encPassword = encrypt(password);
  var employeeFound = null;
  try {
    employeeFound = await employeeModel.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (employeeFound == null) {
    try {
      const employee = await employeeModel.create({
        first_name,
        last_name,
        email,
        contact,
        role: "Employee",
        password: encPassword,
      });
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(409).send("email found");
  }
});

// employee login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const encPassword = encrypt(password);
  try {
    const employee = await employeeModel.findOne({
      email,
      password: encPassword,
    });
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update employee role
app.post("/update_role", async (req, res) => {
  const { id, role } = req.body;
  try {
    await employeeModel.findByIdAndUpdate(id, { role: role });
    res.json("Role Updated.");
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete employee
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await employeeModel.findById(id);
    await employee.remove();
    res.json("Employee Deleted.");
  } catch (err) {
    res.status(500).send(err);
  }
});

// get all tasks
app.get("/task", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get employee's tasks
app.post("/emp_task", async (req, res) => {
  const { employee_id } = req.body;
  try {
    const tasks = await taskModel.find({ employee_id: employee_id });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// add task
app.post("/add_task", async (req, res) => {
  const { task_name, deadline, employee_id } = req.body;
  try {
    const newTask = await taskModel.create({
      task_name,
      deadline,
      status: "Pending",
      employee_id,
    });
    res.json(newTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update task status
app.post("/update_status", async (req, res) => {
  const { id, status } = req.body;
  try {
    await taskModel.findByIdAndUpdate(id, { status: status });
    res.json("Task Status Updated.");
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete task
app.delete("/task/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskModel.findById(id);
    await task.remove();
    res.json("Task Deleted.");
  } catch (err) {
    res.status(500).send(err);
  }
});

// add employee attendance
app.post("/attendance_check_in", async (req, res) => {
  const { employee_id, employee_name } = req.body;
  const date = new Date();
  try {
    const attendance = await attendanceModel.create({
      employee_id,
      employee_name,
      date: `${date.getDate()}d-${date.getMonth() + 1}m-${date.getFullYear()}y`,
      check_in: `${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s`,
      check_out: "",
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update employee attendance
app.post("/attendance_check_out", async (req, res) => {
  const { id } = req.body;
  const date = new Date();
  try {
    await attendanceModel.findByIdAndUpdate(id, {
      check_out: `${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s`,
    });
    res.json("Attendance (Checkout).");
  } catch (err) {
    res.status(500).send(err);
  }
});

// get employee's attendance
app.get("/attendance", async (req, res) => {
  const { id } = req.params;
  const date = new Date();
  try {
    const attendance = await attendanceModel
      .find({
        date: `${date.getDate()}d-${
          date.getMonth() + 1
        }m-${date.getFullYear()}y`,
      })
      .distinct("employee_id");
    res.json(attendance);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.PORT || 5000);
