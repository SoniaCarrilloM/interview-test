import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define action types
export enum SchoolActionKind {
  SET_TEACHERS = "SET_TEACHERS",
  SET_STUDENTS = "SET_STUDENTS",
  SET_ASSIGNMENTS = "SET_ASSIGNMENTS",
  ADD_TEACHER = "ADD_TEACHER",
  ADD_STUDENT = "ADD_STUDENT",
  UPDATE_STUDENT = "UPDATE_STUDENT",
  ASSIGN_STUDENT_TO_TEACHER = "ASSIGN_STUDENT_TO_TEACHER",
  ASSIGN_ASSIGNMENT = "ASSIGN_ASSIGNMENT",
  GRADE_ASSIGNMENT = "GRADE_ASSIGNMENT",
  GENERATE_REPORT = "GENERATE_REPORT",
}

// Define the shape of the state
interface Assignment {
  id: string;
  title: string;
  studentId: string;
  grade: string;
  date: string;
}

interface Student {
  id: string;
  name: string;
  assignments: Assignment[];
}

interface Teacher {
  id: string;
  name: string;
  students: string[];
}

interface SchoolState {
  teachers: Teacher[];
  students: Student[];
  assignments: Assignment[];
}

// Define the shape of the actions
interface SchoolAction {
  type: SchoolActionKind;
  payload: any;
}

// Create the initial state
const initialState: SchoolState = {
  teachers: [],
  students: [],
  assignments: [],
};

// Create the reducer function
export const schoolReducer = (
  state: SchoolState,
  action: SchoolAction
): SchoolState => {
  switch (action.type) {
    case SchoolActionKind.SET_TEACHERS:
      return {
        ...state,
        teachers: action.payload,
      };
    case SchoolActionKind.SET_STUDENTS:
      return {
        ...state,
        students: action.payload,
      };
    case SchoolActionKind.SET_ASSIGNMENTS:
      return {
        ...state,
        assignments: action.payload,
      };
    case SchoolActionKind.ADD_TEACHER:
      return {
        ...state,
        teachers: [...state.teachers, action.payload],
      };
    case SchoolActionKind.ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, { ...action.payload, assignments: [] }],
      };
    case SchoolActionKind.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.id
            ? { ...student, name: action.payload.name }
            : student
        ),
      };
    case SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER:
      return {
        ...state,
        teachers: state.teachers.map((teacher) =>
          teacher.id === action.payload.teacherId
            ? {
                ...teacher,
                students: [...teacher.students, action.payload.studentId],
              }
            : teacher
        ),
      };
    case SchoolActionKind.ASSIGN_ASSIGNMENT:
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.studentId
            ? {
                ...student,
                assignments: [
                  ...student.assignments,
                  {
                    id: crypto.randomUUID(),
                    title: action.payload.assignment,

                    grade: action.payload.grade, // Ensure this property is provided
                    date: action.payload.date, // Ensure this property is provided
                    studentId: action.payload.studentId, // Add the missing property
                  },
                ],
              }
            : student
        ),
      };
    case SchoolActionKind.GRADE_ASSIGNMENT:
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.studentId
            ? {
                ...student,
                assignments: student.assignments.map((a) =>
                  a.title === action.payload.assignment
                    ? { ...a, grade: action.payload.grade }
                    : a
                ),
              }
            : student
        ),
      };
    case SchoolActionKind.GENERATE_REPORT:
      // This action doesn't modify the state directly, it's handled in the component
      return state;
    default:
      return state;
  }
};

// Create context
const SchoolStateContext = createContext<SchoolState | undefined>(undefined);
const SchoolDispatchContext = createContext<
  React.Dispatch<SchoolAction> | undefined
>(undefined);

// Create provider
export const SchoolProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(schoolReducer, initialState);

  return (
    <SchoolStateContext.Provider value={state}>
      <SchoolDispatchContext.Provider value={dispatch}>
        {children}
      </SchoolDispatchContext.Provider>
    </SchoolStateContext.Provider>
  );
};

// Custom hooks to use the context
export const useSchool = () => {
  const context = useContext(SchoolStateContext);
  if (context === undefined) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
};

export const useSchoolDispatch = () => {
  const context = useContext(SchoolDispatchContext);
  if (context === undefined) {
    throw new Error("useSchoolDispatch must be used within a SchoolProvider");
  }
  return context;
};
