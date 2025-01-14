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
    fetch("http://127.0.0.1:3001/teachers")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched teachers:", data); // Add console log
        schoolDispatch?.({
          type: SchoolActionKind.SET_TEACHERS,
          payload: data,
        });
      });

    fetch("http://127.0.0.1:3001/students")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched students:", data); // Add console log
        schoolDispatch?.({
          type: SchoolActionKind.SET_STUDENTS,
          payload: data,
        });
      });

    fetch("http://127.0.0.1:3001/assignments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched assignments:", data); // Add console log
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

    fetch("http://127.0.0.1:3001/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newTeacher]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        console.log("Added teacher:", newTeacher); // Add console log
        schoolDispatch?.({
          type: SchoolActionKind.ADD_TEACHER,
          payload: newTeacher,
        });
      })
      .catch((error) => {
        console.error("Error adding teacher:", error); // Add console log
      });

    target.reset();
  };

  const handleStudentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const studentName = target.student.value;
    const id = crypto.randomUUID();
    const newStudent = { name: studentName, id, assignments: [] };

    fetch("http://127.0.0.1:3001/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newStudent]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        console.log("Added student:", newStudent); // Add console log
        schoolDispatch?.({
          type: SchoolActionKind.ADD_STUDENT,
          payload: newStudent,
        });
      })
      .catch((error) => {
        console.error("Error adding student:", error); // Add console log
      });

    target.reset();
  };

  const handleUpdateStudent = () => {
    if (studentEditingId) {
      const updatedStudent = { name: updatedStudentName, id: studentEditingId };

      fetch(`http://127.0.0.1:3001/students/${studentEditingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      }).then(() => {
        console.log("Updated student:", updatedStudent); // Add console log
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
      fetch(`http://127.0.0.1:3001/teachers/${teacherEditingId}/students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: [newAssignedStudentId] }),
      }).then(() => {
        console.log("Assigned student:", newAssignedStudentId); // Add console log
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

    console.log("Assigning assignment:", newAssignment); // Add console log

    fetch(`http://127.0.0.1:3001/students/${studentId}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAssignment),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        console.log("Assigned assignment:", newAssignment); // Add console log
        schoolDispatch?.({
          type: SchoolActionKind.ASSIGN_ASSIGNMENT,
          payload: {
            studentId,
            assignment: newAssignment,
          },
        });
        setAssignmentState("");
      })
      .catch((error) => {
        console.error("Error assigning assignment:", error); // Add console log
      });
  };

  const handleGradeAssignment = (studentId: string) => {
    fetch(`http://127.0.01:3001/assignments/${assignment}/grade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grade }),
    }).then(() => {
      console.log("Graded assignment:", { studentId, assignment, grade }); // Add console log
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
    console.log("Generating report for date:", date); // Add console log

    fetch(`http://127.0.0.1:3001/assignments/report?date=${date}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const reportData = data.report.map((assignment: any) => {
          const passed = assignment.grade === "Pass";
          return { id: assignment.studentId, passed };
        });

        const passedCount =
          reportData.filter((student: any) => student.passed).length || 0;
        console.log(`Number of students who passed on ${date}: ${passedCount}`);
        setReport(reportData);
      })
      .catch((error) => {
        console.error("Error generating report:", error); // Add console log
      });
  };

  return (
    <div className="App">
      <img src="/infinitas-logo.svg" alt="Infinitas Logo" />

      <h1>IL Interview-Test</h1>

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
          <h2>Select Student</h2>
          <label htmlFor="studentSelect"></label>
          <select
            id="studentSelect"
            value={studentEditingId || ""}
            onChange={(e) => setUserEditingId(e.target.value)}
          >
            <option value="">Select Student</option>
            {school?.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="section">
          <h2>Select Assignment</h2>
          <label htmlFor="assignment"></label>
          <select
            id="assignment"
            value={assignment}
            onChange={(e) => setAssignmentState(e.target.value)}
          >
            <option value="">Select Assignment</option>
            <option value="middleAges">🏰 Middle Ages</option>
            <option value="industrialRevolution">
              🏭 Industrial Revolution
            </option>
            <option value="renaissance">🎨 Renaissance</option>
          </select>
          <button
            style={{ color: "red" }}
            onClick={() => handleAssignAssignment(studentEditingId!)}
          >
            Save
          </button>
        </div>
        <div>
          <label htmlFor="grade"></label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">Select Grade</option>
            <option value="passed">😊 Passed</option>
            <option value="failed">😢 Failed</option>
          </select>
          <button
            style={{ color: "red" }}
            onClick={() => handleGradeAssignment(studentEditingId!)}
          >
            Save
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
