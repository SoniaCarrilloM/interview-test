const express = require("express");
const bodyParser = require("body-parser");
const assignmentRoutes = require("./node/server/assignmentRoute");
const teacherRoutes = require("./node/server/teacherRoutes");
const studentRoutes = require("./node/server/studentRoute");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Register routes
assignmentRoutes(app);
teacherRoutes(app);
studentRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
