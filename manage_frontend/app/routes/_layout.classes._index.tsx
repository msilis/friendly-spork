import { Link, useLoaderData, useRevalidator } from "@remix-run/react";
import { getClasses, getTeachers, getStudents, deleteClass } from "~/data/data";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { useRef, useState } from "react";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  try {
    const [classData, teacherData, studentData] = await Promise.all([
      getClasses(),
      getTeachers(),
      getStudents(),
    ]);
    return Response.json({ classData, teacherData, studentData });
  } catch (error) {
    console.error(
      "There was an error getting information from the database: ",
      error
    );
    return Response.json(
      {
        message:
          "Sorry, there was an error getting info from the database. Please try again later.",
      },
      { status: 500 }
    );
  }
};

const Classes = () => {
  const { classData, teacherData, studentData, message } = useLoaderData<{
    message?: string;
    classData?: ClassRecord[];
    teacherData?: TeacherRecord[];
    studentData?: StudentRecord[];
  }>();

  const studentRef = useRef<HTMLDialogElement>(null);
  const [currentClassStudents, setCurrentClassStudents] = useState<
    StudentRecord[] | undefined
  >([]);
  const errorMessage = message;
  const revalidate = useRevalidator();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const handleModalShow = (currentStudents: number[]) => {
    setCurrentClassStudents([]);
    const studentsWithNames = currentStudents
      .map((currentStudent) => {
        return studentData?.find((student: StudentRecord | undefined) => {
          return student?.id === Number(currentStudent);
        });
      })
      .filter((student) => student !== undefined);

    setCurrentClassStudents(studentsWithNames);
    studentRef.current?.showModal();
  };

  const teacherName = (id: number) => {
    const teacherName = teacherData?.find((teacher: TeacherRecord) => {
      return teacher.id === id;
    });
    let name;
    if (teacherName !== undefined) {
      name = `${teacherName?.teacher_first_name} ${teacherName?.teacher_last_name}`;
    } else name = "None assigned";

    return name;
  };
  let classIdToDelete: number | undefined;
  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    classIdToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteClass(classIdToDelete);
    classIdToDelete = undefined;
    confirmationRef.current?.close();
    revalidate.revalidate();
    toast.success("Class deleted successfully");
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
      <h1 className="text-xl font-bold mb-4">Classes</h1>
      <Link to={"/classes/add"}>
        <button className="btn btn-outline btn-primary btn-sm mb-4">
          Add Class
        </button>
      </Link>
      <table className="table table-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Class Location</th>
            <th>Class Start Time</th>
            <th>Class End Time</th>
            <th>Class Students</th>
            <th>No of Students</th>
            <th>Class Teacher</th>
            <th>Class Accompanist</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classData?.map((laud_class: ClassRecord) => {
            return (
              <tr key={laud_class.id}>
                <td>{laud_class.id}</td>
                <td>
                  <Link
                    to={`/classes/${laud_class.id?.toString()}`}
                    className="hover:underline hover:text-blue-500"
                    title="Click to see class info"
                  >
                    {laud_class.class_name}
                  </Link>
                </td>
                <td>{laud_class.class_location}</td>
                <td>{laud_class.class_start_time}</td>
                <td>{laud_class.class_end_time}</td>
                {laud_class.class_students ? (
                  <td
                    onClick={() => handleModalShow(laud_class.class_students)}
                    className="hover:cursor-pointer hover:underline hover:text-blue-500"
                  >
                    Click to see students
                  </td>
                ) : (
                  <td> None assigned</td>
                )}
                <td>{laud_class.class_students?.length}</td>
                <td>
                  {laud_class.class_teacher
                    ? teacherName(laud_class.class_teacher)
                    : "None assigned"}
                </td>
                <td>
                  {laud_class.class_teacher
                    ? teacherName(laud_class.class_accompanist)
                    : "None assigned"}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(laud_class.id)}
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
      <dialog ref={studentRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => studentRef.current?.close()}
          >
            ✕
          </button>

          {currentClassStudents?.map((record: StudentRecord) => (
            <p key={record.id}>
              {record.first_name} {record.last_name}
            </p>
          ))}
        </div>
      </dialog>
      <dialog ref={confirmationRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => confirmationRef.current?.close()}
          >
            ✕
          </button>
          <p>Are you sure you want to delete this class?</p>
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

export default Classes;
