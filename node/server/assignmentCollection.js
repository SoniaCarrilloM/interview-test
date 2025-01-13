const assignment = require("./assignment");

module.exports = (() => {
  let instance;

  const createInstance = () => {
    let assignments = {};
    return {
      addAssignment: (assignment) => {
        assignments[assignment.id] = assignment;
      },
      getAssignments: () => {
        return Object.values(assignments);
      },
      getAssignmentById: (assignmentId) => {
        return assignments[assignmentId];
      },
      clear: () => {
        assignments = {};
      },
    };
  };

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
