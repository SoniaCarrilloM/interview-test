import { SchoolActionKind, schoolReducer } from "../src/school-context";
import { describe, test, expect } from "@jest/globals";

describe("School reducer test", () => {
  describe("Add Teacher action", () => {
    test("should add a teacher", () => {
      const state = schoolReducer(
        { teachers: [], students: [], assignments: [] },
        {
          type: SchoolActionKind.ADD_TEACHER,
          payload: { id: "1", name: "First Teacher", students: [] },
        }
      );
      expect(state.teachers[0].id).toBe("1");
    });
  });
});
