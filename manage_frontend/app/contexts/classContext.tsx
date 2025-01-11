import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";

interface ClassContextType {
  classInformation: ClassRecord | null;
  setClassInformation: (classinfo: ClassRecord) => void;
  studentInformation: StudentRecord[] | null;
  setStudentInformation: (studentInfo: StudentRecord[] | null) => void;
  teacherInformation: TeacherRecord[] | null;
  setTeacherInformation: (teacherInfo: TeacherRecord[] | null) => void;
}

interface ClassProviderProps {
  children: ReactNode;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classInformation, setClassInformation] = useState<ClassRecord | null>(
    null
  );
  const [studentInformation, setStudentInformation] = useState<
    StudentRecord[] | null
  >(null);
  const [teacherInformation, setTeacherInformation] = useState<
    TeacherRecord[] | null
  >(null);

  useEffect(() => {
    if (classInformation) {
      sessionStorage.setItem(
        "classInformation",
        JSON.stringify(classInformation)
      );
    } else sessionStorage.removeItem("classInformation");
  }, [classInformation]);

  useEffect(() => {
    if (studentInformation) {
      sessionStorage.setItem(
        "studentInformation",
        JSON.stringify(studentInformation)
      );
    } else sessionStorage.removeItem("studentInformation");
  }, [studentInformation]);

  useEffect(() => {
    if (teacherInformation) {
      sessionStorage.setItem(
        "teacherInformation",
        JSON.stringify(teacherInformation)
      );
    } else sessionStorage.removeItem("teacherInformation");
  }, [teacherInformation]);

  return (
    <ClassContext.Provider
      value={{
        classInformation,
        setClassInformation,
        studentInformation,
        setStudentInformation,
        teacherInformation,
        setTeacherInformation,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a UseProvider");
  }
  return context;
};
