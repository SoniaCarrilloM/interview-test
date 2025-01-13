const StudentCollection = require("./studentCollection");
const AssignmentCollection = require("./assignmentCollection");

module.exports = (app) => {
  const studentList = StudentCollection.getInstance();
  const assignmentList = AssignmentCollection.getInstance();

  // Get all students
  app.route("/students").get((req, res) => {
    res.json(studentList.getStudents());
  });

  // Add new students
  app.route("/students").post((req, res) => {
    const students = req.body;
    if (!Array.isArray(students)) {
      res.status(400).send("Students should be an array");
      return;
    }

    students.forEach((student) => {
      studentList.addStudent(student);
    });

    res.sendStatus(201);
  });

  // Update a student by ID
  app.route("/students/:studentId").put((req, res) => {
    const putBody = req.body;
    const studentId = req.params.studentId;
    const studentToUpdate = studentList.getStudentById(studentId);
    if (!studentToUpdate) {
      res.status(404).send("Student not found");
      return;
    }
    studentToUpdate.name = putBody.name || studentToUpdate.name;
    res.json(studentToUpdate);
  });

  // Assign an assignment to a student
  app.route("/students/:studentId/assignments").post((req, res) => {
    const studentId = req.params.studentId;
    const assignment = req.body;
    const student = studentList.getStudentById(studentId);
    if (!student) {
      res.status(404).send("Student not found");
      return;
    }
    student.assignments.push(assignment);
    res.json(student);
  });

  // Grade an assignment for a student
  app
    .route("/students/:studentId/assignments/:assignmentId/grade")
    .put((req, res) => {
      const studentId = req.params.studentId;
      const assignmentId = req.params.assignmentId;
      const { grade } = req.body;
      const student = studentList.getStudentById(studentId);
      if (!student) {
        res.status(404).send("Student not found");
        return;
      }
      const assignment = student.assignments.find((a) => a.id === assignmentId);
      if (!assignment) {
        res.status(404).send("Assignment not found");
        return;
      }
      assignment.grade = grade;
      res.json(assignment);
    });

  // Generate report
  app.route("/assignments/report").get((req, res) => {
    const date = req.query.date;
    const report = assignmentList
      .getAssignmentsByDate(date)
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
