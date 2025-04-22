import { Link, useLoaderData, useRevalidator } from "@remix-run/react";
import { getClasses, getTeachers, getStudents, deleteClass } from "~/data/data";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { useRef, useState } from "react";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  const [classData, teacherData, studentData] = await Promise.all([
    getClasses(),
    getTeachers(),
    getStudents(),
  ]);
  return Response.json({ classData, teacherData, studentData });
};

const Classes = () => {
  const { classData, teacherData, studentData } =
    useLoaderData<typeof loader>();

  const studentRef = useRef<HTMLDialogElement>(null);
  const [currentClassStudents, setCurrentClassStudents] = useState<
    StudentRecord[]
  >([]);
  const revalidate = useRevalidator();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const handleModalShow = (currentStudents: number[]) => {
    setCurrentClassStudents([]);
    const studentsWithNames = currentStudents.map((currentStudent) => {
      return studentData.find((student: StudentRecord) => {
        return student.id === Number(currentStudent);
      });
    });

    setCurrentClassStudents(studentsWithNames);
    studentRef.current?.showModal();
  };

  const teacherName = (id: number) => {
    const teacherName = teacherData.find((teacher: TeacherRecord) => {
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
    revalidate.revalidate();
    classIdToDelete = undefined;
    confirmationRef.current?.close();
    toast.success("Class deleted successfully");
  };

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
          {classData.map((laud_class: ClassRecord) => {
            return (
              <tr key={laud_class.id}>
                <td>{laud_class.id}</td>
                <td>
                  <Link to={`/classes/${laud_class.id?.toString()}`}>
                    {laud_class.class_name}
                  </Link>
                </td>
                <td>{laud_class.class_location}</td>
                <td>{laud_class.class_start_time}</td>
                <td>{laud_class.class_end_time}</td>
                {laud_class.class_students ? (
                  <td
                    onClick={() => handleModalShow(laud_class.class_students)}
                    className="hover:cursor-pointer"
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
                  <button onClick={() => handleDeleteClick(laud_class.id)}>
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
