const StudentCollection = require("./studentCollection");
const TeacherCollection = require("./teacherCollection");

module.exports = (app) => {
  const studentList = StudentCollection.getInstance();
  const teacherList = TeacherCollection.getInstance();

  // Get all teachers
  app.route("/teachers").get((req, res) => {
    const teachers = teacherList.getTeachers();
    console.log("Retrieved teachers:", teachers); // Logging for debugging
    res.json(teachers);
  });

  // Add new teachers
  app.route("/teachers").post((req, res) => {
    const teachers = req.body;
    if (!Array.isArray(teachers)) {
      res.status(400).send("Teachers should be an array");
      return;
    }

    teachers.forEach((teacher) => {
      teacherList.addTeacher(teacher);
    });

    res.sendStatus(201);
  });

  // Update a teacher by ID
  app.route("/teachers/:teacherId").put((req, res) => {
    const putBody = req.body;
    const teacherId = req.params.teacherId;
    const teacherToUpdate = teacherList.getTeacherById(teacherId);
    if (!teacherToUpdate) {
      res.status(404).send("Teacher not found");
      return;
    }
    teacherToUpdate.name = putBody.name || teacherToUpdate.name;
    res.json(teacherToUpdate);
  });

  // Assign students to a teacher
  app.route("/teachers/:teacherId/students").put((req, res) => {
    const putBody = req.body;
    const teacherId = req.params.teacherId;
    const teacherToUpdate = teacherList.getTeacherById(teacherId);
    if (!teacherToUpdate) {
      res.status(404).send("Teacher not found");
      return;
    }

    if (!Array.isArray(putBody.students)) {
      res.status(400).send("Students should be an array");
      return;
    }

    putBody.students.forEach((studentId) => {
      const studentToAdd = studentList.getStudentById(studentId);
      if (studentToAdd) {
        teacherToUpdate.students.push(studentToAdd.id);
      }
    });

    res.json(teacherToUpdate);
  });

  // Get students assigned to a teacher
  app.route("/teachers/:teacherId/students").get((req, res) => {
    const teacherId = req.params.teacherId;
    const teacher = teacherList.getTeacherById(teacherId);
    if (!teacher) {
      res.status(404).send("Teacher not found");
      return;
    }

    const students = teacher.students.map((studentId) =>
      studentList.getStudentById(studentId)
    );
    console.log("Retrieved students for teacher:", students); // Logging for debugging
    res.json(students);
  });
};
