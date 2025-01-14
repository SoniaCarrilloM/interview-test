const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const assignmentRoutes = require("./assignmentRoutes");
const teacherRoutes = require("./teacherRoutes");
const studentRoutes = require("./studentRoutes");

const app = express();
const port = process.env.PORT || 3002; //

// Middleware
app.use(cors({ origin: "http://localhost:3002" })); // Add this line to allow requests from the frontend's origin
app.use(bodyParser.json());
app.listen(3001, () => {
  console.log("Server is running on port 3001");

  // Register routes
  assignmentRoutes(app);
  teacherRoutes(app);
  studentRoutes(app);
});

module.exports = app;
