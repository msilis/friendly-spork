import { useLoaderData, Link, json, useRevalidator } from "@remix-run/react";
import {
  deleteStudent,
  getFamilies,
  getStudents,
  getTeachers,
} from "~/data/data";
import { useRef } from "react";
import { FamilyRecord, StudentRecord, TeacherRecord } from "~/types/types";

export const loader = async () => {
  const [students, families, teachers] = await Promise.all([
    getStudents(),
    getFamilies(),
    getTeachers(),
  ]);
  return json({ students, families, teachers });
};

const Students = () => {
  const { students, families, teachers } = useLoaderData<typeof loader>();
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
  const confirmationRef = useRef<HTMLDialogElement>(null);
  let studentIdToDelete: number | undefined;

  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    studentIdToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteStudent(studentIdToDelete);
    revalidate.revalidate();
    studentIdToDelete = undefined;
    confirmationRef.current?.close();
  };

  return (
    <div>
      <Link to={"/students/add"}>
        <button className="btn-link">Add Student</button>
      </Link>
      <div className="overflow-x-auto">
        <h1 className="text-xl">Students</h1>
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
            {students.map((student: StudentRecord) => {
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    <Link to={`/students/${student.id?.toString()}`}>
                      {student.first_name}
                    </Link>
                  </td>
                  <td>{student.last_name}</td>
                  <td>{student.birthdate}</td>
                  <td>{getFamilyLastName(student)}</td>
                  <td>{getTeacherLastName(student)}</td>
                  <td>
                    <button onClick={() => handleDeleteClick(student.id)}>
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
    </div>
  );
};

export default Students;
