import {
  useLoaderData,
  Link,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import {
  deleteStudent,
  getFamilies,
  getStudents,
  getTeachers,
} from "~/data/data.server";
import { useEffect, useRef, useState } from "react";
import { FamilyRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { useToast } from "~/hooks/hooks";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const studentToDelete = formData.get("student_id");

    if (typeof studentToDelete === "string" && studentToDelete) {
      try {
        const result = await deleteStudent(parseInt(studentToDelete, 10));
        if (result?.success) {
          return Response.json({
            success: true,
            message: "Student deleted sucessfully",
          });
        } else {
          return Response.json({
            success: false,
            message: "There was an error deleting the student",
          });
        }
      } catch (error) {
        console.error("There was an error deleting the student");
        return Response.json({
          status: false,
          message: "There was server error deleting the student",
        });
      }
    }
  }
};

export const loader = async () => {
  try {
    const [students, families, teachers] = await Promise.all([
      getStudents(),
      getFamilies(),
      getTeachers(),
    ]);
    return Response.json({ students, families, teachers });
  } catch (error) {
    console.error("There was an error getting info from the database: ", error);
    return Response.json(
      { message: "There was an error getting info from the database" },
      { status: 500 }
    );
  }
};

const Students = () => {
  const loaderData = useLoaderData<{
    message?: string;
    students?: StudentRecord[];
    families?: FamilyRecord[];
    teachers?: TeacherRecord[];
  }>();
  const students = loaderData.students;
  const families = loaderData.families;
  const teachers = loaderData.teachers;
  const errorMessage = loaderData.message;
  const fetcher = useFetcher();
  const [studentOrder, setStudentOrder] = useState<StudentRecord[] | undefined>(
    students
  );
  const getFamilyLastName = (student: StudentRecord) => {
    const name =
      families?.find((family: FamilyRecord) => family.id === student.family_id)
        ?.family_last_name || "Not assigned";

    return name;
  };

  const getTeacherLastName = (student: StudentRecord) => {
    const name =
      teachers?.find(
        (teacher: TeacherRecord) => teacher.id === student.teacher_id
      )?.teacher_last_name || "Not assigned";
    return name;
  };

  useEffect(() => {
    if (students) {
      setStudentOrder(students);
    }
  }, [students]);

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
    if (!students) return null;
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
    if (studentIdToDelete !== undefined) {
      fetcher.submit(
        {
          intent: "delete",
          student_id: studentIdToDelete?.toString(),
        },
        {
          method: "POST",
        }
      );
      revalidate.revalidate();
      studentIdToDelete = undefined;
      confirmationRef.current?.close();
      toast.success("Student deleted successfully");
    } else {
      toast.error("There was an issue deleting this student.");
      return;
    }
  };

  if (errorMessage) {
    return (
      <div className="alert alert-error w-5/6 mt-8">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <span>{errorMessage}</span>
      </div>
    );
  }

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
          {studentOrder?.length
            ? studentOrder?.map((student: StudentRecord) => {
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
              })
            : null}
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
