const chai = require("chai");
const request = require("supertest");
const StudentCollection = require("../server/studentCollection");
const AssignmentCollection = require("../server/assignmentCollection");

const expect = chai.expect;

const studentList = StudentCollection.getInstance();
const assignmentList = AssignmentCollection.getInstance();

module.exports = {
  resetCollections: async () => {
    studentList.students = [];
    assignmentList.assignments = [];
  },

  createTestStudent: async (
    app,
    studentData = { id: "1", name: "Student" }
  ) => {
    const postResult = await request(app)
      .post("/students")
      .send([studentData])
      .set("Content-Type", "application/json");

    expect(postResult.statusCode).to.equal(201);
    return studentData;
  },

  createTestAssignment: async (app, assignmentData) => {
    const postResult = await request(app)
      .post(`/students/${assignmentData.studentId}/assignments`)
      .send(assignmentData)
      .set("Content-Type", "application/json");

    expect(postResult.statusCode).to.equal(200);
    return assignmentData;
  },

  addStudentToTeacher: async (app, studentId, teacherId) => {
    const putResult = await request(app)
      .put(`/teachers/${teacherId}`)
      .send({ studentId })
      .set("Content-Type", "application/json");

    expect(putResult.statusCode).to.equal(200);
  },

  createTestTeacher: async (
    app,
    teacherData = { id: "1", name: "Teacher" }
  ) => {
    const postResult = await request(app)
      .post("/teachers")
      .send(teacherData)
      .set("Content-Type", "application/json");

    expect(postResult.statusCode).to.equal(201);
    return teacherData;
  },
};
