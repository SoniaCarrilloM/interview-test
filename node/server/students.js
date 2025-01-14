module.exports = (name, id) => {
  const assignments = [];

  return {
    name,
    id,
    assignments,
    addAssignment: (assignment) => {
      assignments.push(assignment);
    },
    getAssignments: () => assignments,
    assignGrade: (assignmentId, grade) => {
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (assignment) {
        assignment.assignGrade(grade);
      } else {
        throw new Error("Assignment not found.");
      }
    },
  };
};
