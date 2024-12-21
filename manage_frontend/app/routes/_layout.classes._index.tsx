import { Link, useLoaderData, json } from "@remix-run/react";
import { getClasses, getTeachers, getStudents } from "~/data/data";
import { ClassRecord, StudentRecord } from "~/types/types";
import { useRef, useState } from "react";

export const loader = async () => {
  const [classData, teacherData, studentData] = await Promise.all([
    getClasses(),
    getTeachers(),
    getStudents(),
  ]);
  return json({ classData, teacherData, studentData });
};

const Classes = () => {
  const { classData, teacherData, studentData } =
    useLoaderData<typeof loader>();

  const studentRef = useRef<HTMLDialogElement>(null);
  const [currentClassStudents, setCurrentClassStudents] = useState<string[]>(
    []
  );

  const handleModalShow = (currentStudents: []) => {
    setCurrentClassStudents([]);
    const studentsWithNames = currentStudents.map((currentStudent) => {
      console.log(currentStudent, "currentStudent");
      return studentData.find((student) => {
        console.log(student);
        return student.id === currentStudent;
      });
    });

    setCurrentClassStudents(studentsWithNames);
    studentRef.current?.showModal();
  };

  console.log(currentClassStudents, "currentClassStudents");
  console.log(currentClassStudents.length, "length");

  return (
    <div>
      <Link to={"/classes/add"}>
        <button className="btn-link">Add Class</button>
      </Link>
      <div className="overflow-x-auto">
        <h1 className="text-xl">Classes</h1>
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
            </tr>
          </thead>
          <tbody>
            {classData.map((laud_class: ClassRecord) => {
              return (
                <tr key={laud_class.id}>
                  <td>{laud_class.id}</td>
                  <td>{laud_class.class_name}</td>
                  <td>{laud_class.class_location}</td>
                  <td>{laud_class.class_start_time}</td>
                  <td>{laud_class.class_end_time}</td>
                  <td
                    onClick={() => handleModalShow(laud_class.class_students)}
                    className="hover:cursor-pointer"
                  >
                    Click to see students
                  </td>
                  <td>{laud_class.class_students?.length}</td>
                  <td>{laud_class.class_teacher}</td>
                  <td>{laud_class.class_accompanist}</td>
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
            {currentClassStudents.length > 0 ? (
              currentClassStudents.map((student: StudentRecord) => {
                return (
                  <p
                    key={student.id}
                  >{`${student.first_name} ${student.last_name}`}</p>
                );
              })
            ) : (
              <p>No students assigned to this class.</p>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Classes;
