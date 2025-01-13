const express = require("express");
const bodyParser = require("body-parser");
const assignmentRoutes = require("./assignmentRoutes");
const teacherRoutes = require("./teacherRoutes");
const studentRoutes = require("./studentRoutes");

const app = express();
const port = process.env.PORT || 3001; // Change the port to 3001

app.use(bodyParser.json());

// Register routes
assignmentRoutes(app);
teacherRoutes(app);
studentRoutes(app);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
