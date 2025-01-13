class TeacherCollection {
  constructor() {
    this.teachers = [
      { id: 1, name: "Mr. Smith", students: [] },
      { id: 2, name: "Ms. Johnson", students: [] },
      { id: 3, name: "Mrs. Brown", students: [] },
    ];
  }

  static getInstance() {
    if (!TeacherCollection.instance) {
      TeacherCollection.instance = new TeacherCollection();
    }
    return TeacherCollection.instance;
  }

  getTeachers() {
    return this.teachers;
  }

  getTeacherById(id) {
    return this.teachers.find((teacher) => teacher.id === parseInt(id));
  }

  addTeacher(teacher) {
    this.teachers.push(teacher);
  }
}

module.exports = TeacherCollection;
