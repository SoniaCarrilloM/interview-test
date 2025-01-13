const assignmentCollection = require("./assignmentCollection");
const studentCollection = require("./studentCollection");

module.exports = (app) => {
  const assignmentList = assignmentCollection.getInstance();
  const studentList = studentCollection.getInstance();

  // Get all assignments
  app.route("/assignments").get((req, res) => {
    res.json(assignmentList.getAssignments());
  });

  // Add new assignments
  app.route("/assignments").post((req, res) => {
    const assignments = req.body;
    if (!Array.isArray(assignments)) {
      res.status(400).send("Assignments should be an array");
      return;
    }

    assignments.forEach((assignment) => {
      assignmentList.addAssignment(assignment);
    });

    res.sendStatus(201);
  });

  // Update assignments
  app.route("/assignments").put((req, res) => {
    const assignments = req.body;
    if (!Array.isArray(assignments)) {
      res.status(400).send("Assignments should be an array");
      return;
    }

    assignments.forEach((assignmentUpdate) => {
      const assignmentToUpdate = assignmentList.getAssignmentById(
        assignmentUpdate.id
      );
      if (assignmentToUpdate) {
        assignmentToUpdate.title =
          assignmentUpdate.title || assignmentToUpdate.title;
        assignmentToUpdate.studentId =
          assignmentUpdate.studentId || assignmentToUpdate.studentId;
      }
    });

    res.sendStatus(200);
  });

  // Grade an assignment
  app.route("/assignments/:assignmentId/grade").put((req, res) => {
    const putBody = req.body;
    const assignmentId = req.params.assignmentId;
    const assignmentToUpdate = assignmentList.getAssignmentById(assignmentId);
    if (!assignmentToUpdate) {
      res.status(404).send("Assignment not found");
      return;
    }
    if (putBody.grade !== undefined) {
      try {
        assignmentToUpdate.assignGrade(putBody.grade);
      } catch (error) {
        res.status(400).send(error.message);
        return;
      }
    }
    res.json(assignmentToUpdate);
  });

  // Generate report
  app.route("/assignments/report").get((req, res) => {
    const date = req.query.date;
    const report = assignmentList
      .getAssignments()
      .filter((assignment) => assignment.date === date)
      .map((assignment) => {
        const student = studentList.getStudentById(assignment.studentId);
        return {
          assignmentId: assignment.id,
          title: assignment.title,
          studentName: student ? student.name : "Unknown",
          grade: assignment.grade,
        };
      });

    const passedCount = report.filter(
      (assignment) => assignment.grade === "Pass"
    ).length;

    res.json({
      date,
      passedCount,
      report,
    });
  });
};
