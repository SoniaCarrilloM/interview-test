class StudentCollection {
  constructor() {
    this.students = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
  }

  static getInstance() {
    if (!StudentCollection.instance) {
      StudentCollection.instance = new StudentCollection();
    }
    return StudentCollection.instance;
  }

  getStudents() {
    return this.students;
  }

  getStudentById(id) {
    return this.students.find((student) => student.id === parseInt(id));
  }

  addStudent(student) {
    this.students.push(student);
  }
}

module.exports = StudentCollection;
