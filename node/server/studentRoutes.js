const studentCollection = require("./studentCollection");
const teacherCollection = require("./teacherCollection");

module.exports = (app) => {
  const studentList = studentCollection.getInstance();
  const teacherList = teacherCollection.getInstance();

  app.route("/students").get((req, res) => {
    const teacherId = req.query.teacherId;

    teacherId
      ? res.json(
          teacherList
            .getTeacherById(teacherId)
            .students.map((studentId) => studentList.getStudentById(studentId))
        )
      : res.json(studentList.getStudents());
  });

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
};
