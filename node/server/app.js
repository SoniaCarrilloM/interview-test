const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const assignmentRoutes = require("./assignmentRoutes");
const teacherRoutes = require("./teacherRoutes");
const studentRoutes = require("./studentRoutes");

const app = express();
const port = process.env.PORT || 3001; //

// Middleware
app.use(cors({ origin: "http://localhost:3003" })); // Add this line to allow requests from the frontend's origin
app.use(bodyParser.json());

// Register routes
assignmentRoutes(app);
teacherRoutes(app);
studentRoutes(app);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
