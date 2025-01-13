module.exports = (title, id, studentId) => {
  let grade = null;

  return {
    title,
    id,
    studentId,
    grade,
    assignGrade: (newGrade) => {
      if (newGrade === "Pass" || newGrade === "Fail") {
        grade = newGrade;
      } else {
        throw new Error("Invalid grade. Only 'Pass' or 'Fail' are allowed.");
      }
    },
  };
};
