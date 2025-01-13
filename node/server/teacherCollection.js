class TeacherCollection {
  constructor() {
    this.teachers = {};
  }

  getTeachers() {
    return Object.values(this.teachers);
  }

  addTeacher(teacher) {
    this.teachers[teacher.id] = teacher;
  }

  getTeacherById(id) {
    return this.teachers[id];
  }

  clear() {
    this.teachers = {};
  }

  static getInstance() {
    if (!TeacherCollection.instance) {
      TeacherCollection.instance = new TeacherCollection();
    }
    return TeacherCollection.instance;
  }
}

module.exports = TeacherCollection;
