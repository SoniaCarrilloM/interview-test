import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import supertest, { SuperTest, Test } from "supertest";
import app from "../server/app"; // Adjust the path as necessary
import util from "./util";

chai.use(chaiAsPromised);

const request = supertest(app);

describe("Teachers", () => {
  // It works by itself, so remember to run this manually
  it.skip("Should Get An Empty List Of Teachers", async () => {
    const res = await request(app).get("/teachers");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("Should Get List Of Students", async () => {
    const testTeacher = await util.createTestTeacher(app);

    const res = await request(app).get("/teachers");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body).to.deep.include(testTeacher);
  });

  it("Should Add A Student To A Teacher", async () => {
    const testTeacher = await util.createTestTeacher(app);
    const testStudent = await util.createTestStudent(app);

    const putBody = { studentId: testStudent.id };
    const res = await request(app)
      .put(`/teachers/${testTeacher.id}`)
      .send(putBody);

    expect(res.statusCode).to.equal(200);
    const updatedTeacher = res.body;
    expect(updatedTeacher.students).to.deep.include(testStudent);
  });
});
