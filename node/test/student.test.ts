import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { SuperTest, Test } from "supertest";
import app from "../server/app"; // Adjust the path as necessary
import util from "./util";

// const expect = chai.expect; // Remove this line
chai.use(chaiAsPromised);

const request: SuperTest<Test> = supertest(app);

describe("Students", () => {
  beforeEach(async () => {
    // Reset the student and assignment collections before each test
    await util.resetCollections();
  });

  it("Should Get An Empty List Of Students", async () => {
    const res = await request.get("/students");

    console.log("Response body:", res.body); // Add this line to log the response body

    expect(res.status).to.equal(200);
    return expect(res.body).to.be.an("array").that.is.empty;
  });

  it("Should Add New Students", async () => {
    const newStudents = [
      { name: "John Doe", id: "1" },
      { name: "Jane Doe", id: "2" },
    ];
    const res = await request.post("/students").send(newStudents);

    expect(res.status).to.equal(201);

    const getRes = await request.get("/students");
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.be.an("array").that.has.lengthOf(2);
    expect(getRes.body).to.deep.include.members(newStudents);
  });

  it("Should Update Student", async () => {
    const testStudent = await util.createTestStudent(app, {
      name: "John Doe",
      id: "1",
    });

    const res = await request
      .put(`/students/${testStudent.id}`)
      .send({ name: "John Smith" });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("John Smith");

    const getRes = await request.get("/students");
    expect(getRes.body).to.deep.include({ name: "John Smith", id: "1" });
  });

  it("Should Assign an Assignment to a Student", async () => {
    const testStudent = await util.createTestStudent(app, {
      name: "John Doe",
      id: "1",
    });
    const newAssignment = { title: "Math Homework", id: "101", studentId: "1" };

    const res = await request
      .post(`/students/${testStudent.id}/assignments`)
      .send(newAssignment);

    expect(res.status).to.equal(200);
    expect(res.body.assignments)
      .to.be.an("array")
      .that.deep.includes(newAssignment);
  });

  it("Should Grade an Assignment for a Student", async () => {
    const testStudent = await util.createTestStudent(app, {
      name: "John Doe",
      id: "1",
    });
    const newAssignment = await util.createTestAssignment(app, {
      title: "Math Homework",
      id: "101",
      studentId: "1",
    });

    const res = await request
      .put(`/students/${testStudent.id}/assignments/${newAssignment.id}/grade`)
      .send({ grade: "Pass" });

    expect(res.status).to.equal(200);
    expect(res.body.grade).to.equal("Pass");
  });

  it("Should Generate Report", async () => {
    const testStudent = await util.createTestStudent(app, {
      name: "John Doe",
      id: "1",
    });
    const newAssignment = await util.createTestAssignment(app, {
      title: "Math Homework",
      id: "101",
      studentId: "1",
      date: "2023-10-01",
    });

    await request
      .put(`/students/${testStudent.id}/assignments/${newAssignment.id}/grade`)
      .send({ grade: "Pass" });

    const res = await request.get("/assignments/report?date=2023-10-01");

    console.log("Report response body:", res.body); // Add this line to log the response body

    expect(res.status).to.equal(200);
    expect(res.body.date).to.equal("2023-10-01");
    expect(res.body.passedCount).to.equal(1);
    expect(res.body.report).to.be.an("array").that.has.lengthOf(1);
    expect(res.body.report[0]).to.deep.include({
      assignmentId: "101",
      title: "Math Homework",
      studentName: "John Doe",
      grade: "Pass",
    });
  });
});
