class AssignmentCollection {
  constructor() {
    this.assignments = [
      {
        id: 1,
        title: "Middle Ages",
        studentId: 1,
        grade: null,
        date: "2023-10-01",
      },
      {
        id: 2,
        title: "Industrial Revolution",
        studentId: 2,
        grade: null,
        date: "2023-10-02",
      },
      {
        id: 3,
        title: "Renaissance",
        studentId: 3,
        grade: null,
        date: "2023-10-03",
      },
    ];
  }

  static getInstance() {
    if (!AssignmentCollection.instance) {
      AssignmentCollection.instance = new AssignmentCollection();
    }
    return AssignmentCollection.instance;
  }

  getAssignments() {
    return this.assignments;
  }

  getAssignmentById(id) {
    return this.assignments.find(
      (assignment) => assignment.id === parseInt(id)
    );
  }

  addAssignment(assignment) {
    this.assignments.push(assignment);
  }

  assignGrade(assignmentId, grade) {
    const assignment = this.getAssignmentById(assignmentId);
    if (assignment) {
      assignment.grade = grade;
    }
  }

  getAssignmentsByDate(date) {
    return this.assignments.filter((assignment) => assignment.date === date);
  }
}

module.exports = AssignmentCollection;
