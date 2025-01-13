class StudentCollection {
  constructor() {
    this.students = {};
  }

  getStudents() {
    return Object.values(this.students);
  }

  addStudent(student) {
    this.students[student.id] = student;
  }

  getStudentById(id) {
    return this.students[id];
  }

  clear() {
    this.students = {};
  }

  static getInstance() {
    if (!StudentCollection.instance) {
      StudentCollection.instance = new StudentCollection();
    }
    return StudentCollection.instance;
  }
}

module.exports = StudentCollection;
