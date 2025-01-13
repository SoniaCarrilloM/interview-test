import React, { useState, useEffect } from "react";
import {
  SchoolActionKind,
  useSchool,
  useSchoolDispatch,
} from "./school-context";
import "./App.css";

function App() {
  const school = useSchool();
  const schoolDispatch = useSchoolDispatch();

  const [studentEditingId, setUserEditingId] = useState<string | null>(null);
  const [updatedStudentName, setUpdatedStudentName] = useState<string>("");

  const [teacherEditingId, setTeacherEditingId] = useState<string | null>(null);
  const [newAssignedStudentId, setNewAssignedStudentId] = useState<
    string | null
  >(null);
  const [assignment, setAssignmentState] = useState<string>("");
  const [grade, setGrade] = useState<string>("");

  const [report, setReport] = useState<{ id: string; passed: boolean }[]>([]);

  useEffect(() => {
    // Fetch initial data from the backend
    fetch("/teachers")
      .then((response) => response.json())
      .then((data) => {
        schoolDispatch?.({
          type: SchoolActionKind.SET_TEACHERS,
          payload: data,
        });
      });

    fetch("/students")
      .then((response) => response.json())
      .then((data) => {
        schoolDispatch?.({
          type: SchoolActionKind.SET_STUDENTS,
          payload: data,
        });
      });

    fetch("/assignments")
      .then((response) => response.json())
      .then((data) => {
        schoolDispatch?.({
          type: SchoolActionKind.SET_ASSIGNMENTS,
          payload: data,
        });
      });
  }, [schoolDispatch]);

  const handleTeacherSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const teacherName = target.teacher.value;
    const id = crypto.randomUUID();
    const newTeacher = { name: teacherName, id, students: [] };

    fetch("/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newTeacher]),
    }).then(() => {
      schoolDispatch?.({
        type: SchoolActionKind.ADD_TEACHER,
        payload: newTeacher,
      });
    });

    target.reset();
  };

  const handleStudentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const studentName = target.student.value;
    const id = crypto.randomUUID();
    const newStudent = { name: studentName, id, assignments: [] };

    fetch("/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newStudent]),
    }).then(() => {
      schoolDispatch?.({
        type: SchoolActionKind.ADD_STUDENT,
        payload: newStudent,
      });
    });

    target.reset();
  };

  const handleUpdateStudent = () => {
    if (studentEditingId) {
      const updatedStudent = { name: updatedStudentName, id: studentEditingId };

      fetch(`/students/${studentEditingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      }).then(() => {
        schoolDispatch?.({
          type: SchoolActionKind.UPDATE_STUDENT,
          payload: updatedStudent,
        });
      });
    }

    setUserEditingId(null);
    setUpdatedStudentName("");
  };

  const handleAssignStudent = () => {
    if (teacherEditingId && newAssignedStudentId) {
      fetch(`/teachers/${teacherEditingId}/students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: [newAssignedStudentId] }),
      }).then(() => {
        schoolDispatch?.({
          type: SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER,
          payload: {
            teacherId: teacherEditingId,
            studentId: newAssignedStudentId,
          },
        });
      });
    }
  };

  const handleAssignAssignment = (studentId: string) => {
    const newAssignment = {
      id: crypto.randomUUID(),
      title: assignment,
      studentId,
    };

    fetch("/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newAssignment]),
    }).then(() => {
      schoolDispatch?.({
        type: SchoolActionKind.ASSIGN_ASSIGNMENT,
        payload: {
          studentId,
          assignment,
        },
      });
      setAssignmentState("");
    });
  };

  const handleGradeAssignment = (studentId: string) => {
    fetch(`/assignments/${assignment}/grade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grade }),
    }).then(() => {
      schoolDispatch?.({
        type: SchoolActionKind.GRADE_ASSIGNMENT,
        payload: {
          studentId,
          assignment,
          grade,
        },
      });
      setGrade("");
    });
  };

  const handleGenerateReport = (date: string) => {
    fetch("/assignments/report")
      .then((response) => response.json())
      .then((data) => {
        const reportData = data.map((assignment: any) => {
          const passed = assignment.grade === "Pass";
          return { id: assignment.studentId, passed };
        });

        const passedCount =
          reportData.filter((student: any) => student.passed).length || 0;
        console.log(`Number of students who passed on ${date}: ${passedCount}`);
        setReport(reportData);
      });
  };

  return (
    <div className="App">
      <img src="/infinitas-logo.svg" alt="Infinitas Logo" />

      <h1>IL Interview all new features /not refactored (test3newfeatures)</h1>

      <div className="section">
        <h2>Teacher</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.teachers.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>
                    <ul>
                      {teacher.students.map((s) => (
                        <li key={s}>
                          {school?.students.map((s1) =>
                            s === s1.id ? s1.name : ""
                          )}
                        </li>
                      ))}
                    </ul>
                    {teacher.id === teacherEditingId ? (
                      <>
                        <select
                          value={newAssignedStudentId || ""}
                          onChange={(e) =>
                            setNewAssignedStudentId(e.target.value)
                          }
                        >
                          <option value={""}></option>
                          {school?.students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                        <button
                          style={{ color: "orange" }}
                          onClick={handleAssignStudent}
                        >
                          Assign
                        </button>
                      </>
                    ) : (
                      <button
                        style={{ color: "red" }}
                        onClick={() => setTeacherEditingId(teacher.id)}
                      >
                        Assign student
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleTeacherSubmit}>
          <label htmlFor="teacher">Teacher</label>
          <input type="text" id="teacher" name="teacher" />
          <button type="submit" style={{ color: "blue" }}>
            Add Teacher
          </button>
        </form>
      </div>

      <div className="section">
        <h2>Students</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.students.map((student) => {
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    {student.id === studentEditingId ? (
                      <>
                        <input
                          type="text"
                          value={updatedStudentName}
                          onChange={(e) =>
                            setUpdatedStudentName(e.target.value)
                          }
                        ></input>
                        <button
                          style={{ color: "green" }}
                          onClick={handleUpdateStudent}
                        >
                          Done
                        </button>
                      </>
                    ) : (
                      <button
                        style={{ color: "red" }}
                        onClick={() => setUserEditingId(student.id)}
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleStudentSubmit}>
          <label htmlFor="student">Student</label>
          <input type="text" id="student" name="student" />
          <button type="submit" style={{ color: "blue" }}>
            Add Student
          </button>
        </form>
        <div className="section">
          <h2>Assignments</h2>
          <label htmlFor="assignment">Assignment:</label>
          <select
            id="assignment"
            value={assignment}
            onChange={(e) => setAssignmentState(e.target.value)}
          >
            {" "}
            <option value="">Select Assignment</option>{" "}
            <option value="middleAges">🏰 Middle Ages</option>{" "}
            <option value="industrialRevolution">
              {" "}
              🏭 Industrial Revolution
            </option>{" "}
          </select>{" "}
          <button
            style={{ color: "red" }}
            onClick={() => handleAssignAssignment(studentEditingId!)}
          >
            Assign Assignment
          </button>
        </div>
        <div>
          {" "}
          <label htmlFor="grade">Grade:</label>{" "}
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {" "}
            <option value="">Select Grade</option>{" "}
            <option value="passed">😊 Passed</option>{" "}
            <option value="failed">😢 Failed</option>{" "}
          </select>{" "}
          <button
            style={{ color: "red" }}
            onClick={() => handleGradeAssignment(studentEditingId!)}
          >
            Grade Assignment
          </button>
        </div>
      </div>
      <div className="section">
        <h2>Report</h2>
        <input
          type="date"
          onChange={(e) => handleGenerateReport(e.target.value)}
        />
        <ul>
          {report.map((student) => (
            <li key={student.id}>
              {student.id} - {student.passed ? "Passed" : "Failed"}
            </li>
          ))}
        </ul>
        <div>
          Number of students who passed:{" "}
          {report.filter((student) => student.passed).length}
        </div>
      </div>
    </div>
  );
}

export default App;
