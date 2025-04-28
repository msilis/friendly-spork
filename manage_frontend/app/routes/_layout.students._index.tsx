import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import {
  deleteStudent,
  getFamilies,
  getStudents,
  getTeachers,
} from "~/data/data";
import { useRef, useState } from "react";
import { FamilyRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  const [students, families, teachers] = await Promise.all([
    getStudents(),
    getFamilies(),
    getTeachers(),
  ]);
  return Response.json({ students, families, teachers });
};

const Students = () => {
  const { students, families, teachers } = useLoaderData<typeof loader>();
  const [studentOrder, setStudentOrder] = useState<StudentRecord[]>(students);
  const getFamilyLastName = (student: StudentRecord) => {
    const name =
      families.find((family: FamilyRecord) => family.id === student.family_id)
        ?.family_last_name || "Not assigned";

    return name;
  };

  const getTeacherLastName = (student: StudentRecord) => {
    const name =
      teachers.find(
        (teacher: TeacherRecord) => teacher.id === student.teacher_id
      )?.teacher_last_name || "Not assigned";
    return name;
  };

  const revalidate = useRevalidator();
  const toast = useToast();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  let studentIdToDelete: number | undefined;

  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    studentIdToDelete = id;
  };

  const handleStudentReorder = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const currentValue = event.target?.value;
    switch (currentValue) {
      case "lastNameDescending": {
        const sortedNames = [...students].sort(
          (a: StudentRecord, b: StudentRecord) => {
            return b.last_name.localeCompare(a.last_name);
          }
        );
        setStudentOrder(sortedNames);
        break;
      }
      case "lastNameAscending": {
        const sortedNames = [...students].sort(
          (a: StudentRecord, b: StudentRecord) => {
            return a.last_name.localeCompare(b.last_name);
          }
        );
        setStudentOrder(sortedNames);
        break;
      }
      case "familyDescending": {
        const sortedFamilies = [...students].sort(
          (a: StudentRecord, b: StudentRecord) => {
            const lastNameA = getFamilyLastName(a);
            const lastNameB = getFamilyLastName(b);
            return lastNameB.localeCompare(lastNameA);
          }
        );
        setStudentOrder(sortedFamilies);
        break;
      }
      case "familyAscending": {
        const sortedFamilies = [...students].sort(
          (a: StudentRecord, b: StudentRecord) => {
            const lastNameA = getFamilyLastName(a);
            const lastNameB = getFamilyLastName(b);
            return lastNameA.localeCompare(lastNameB);
          }
        );
        setStudentOrder(sortedFamilies);
        break;
      }
      default:
        setStudentOrder(students);
    }
  };

  const handleDeleteConfirmation = () => {
    deleteStudent(studentIdToDelete);
    revalidate.revalidate();
    studentIdToDelete = undefined;
    confirmationRef.current?.close();
    toast.success("Student deleted successfully");
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">Students</h1>
      <Link to={"/students/add"}>
        <button className="btn btn-outline btn-primary btn-sm mb-4">
          Add Student
        </button>
      </Link>
      <div className="mt-2 mb-2">
        <label htmlFor="student-order-select">Order:</label>
        <select
          className="select select-sm ml-2"
          defaultValue="default"
          onChange={(event) => handleStudentReorder(event)}
        >
          <option value="default">Default</option>
          <option value="lastNameDescending">Last Name &#x2193;</option>
          <option value="lastNameAscending">Last Name &#x2191;</option>
          <option value="familyDescending">Family &#x2193;</option>
          <option value="familyAscending">Family &#x2191;</option>
        </select>
      </div>
      <table className="table table-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
            <th>Family</th>
            <th>Teacher</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {studentOrder?.map((student: StudentRecord) => {
            return (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <Link
                    to={`/students/${student.id?.toString()}`}
                    className="hover:underline hover:text-blue-500"
                  >
                    {student.first_name}
                  </Link>
                </td>
                <td>{student.last_name}</td>
                <td>{student.birthdate}</td>
                <td>{getFamilyLastName(student)}</td>
                <td>{getTeacherLastName(student)}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(student.id)}
                    title="Delete"
                  >
                    <img
                      src="icons8-delete.svg"
                      alt="delete student"
                      className="hover:cursor-pointer"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <dialog ref={confirmationRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => confirmationRef.current?.close()}
          >
            ✕
          </button>
          <p>Are you sure you want to delete this student?</p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => confirmationRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-accent"
              onClick={handleDeleteConfirmation}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Students;
