import {
  json,
  Link,
  useLoaderData,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getClass, getStudents, getTeachers } from "~/data/data";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";
import Select from "react-select";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [classData, studentData, teacherData] = await Promise.all([
    getClass(params.id),
    getStudents(),
    getTeachers(),
  ]);

  return json({ classData, studentData, teacherData });
};

const LauderdaleClass = () => {
  const { classData, studentData, teacherData } =
    useLoaderData<typeof loader>();
  const lauderdaleClass: ClassRecord = classData?.[0];
  const [classStudents, setClassStudents] = useState<StudentRecord[]>();
  const modalRef = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    const classStudentNames = () => {
      const studentsWithNames = lauderdaleClass?.class_students.map(
        (student) => {
          return studentData.find((studentRecord: StudentRecord) => {
            return Number(student) === studentRecord.id;
          });
        }
      );
      setClassStudents(studentsWithNames);
    };
    classStudentNames();
  }, [studentData, lauderdaleClass?.class_students]);

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  // TODO: sort out these options
  // const selectOptions = lauderdaleClass.class_students.map((student) => ({
  //   value = { student },
  // }));

  return (
    <>
      <Link to={"/classes"}>
        <button className="btn-link">Back</button>
      </Link>
      <section className="ml-12 flex">
        <div>
          <h1 className="font-semibold text-lg pb-4 pt-4">Class Detail</h1>
          <h2 className="font-light mb-2">Class Name</h2>
          <p className="pb-4 ">{lauderdaleClass.class_name}</p>
          <h2 className="font-light mb-2">Class Location</h2>
          <p className="pb-4">{lauderdaleClass.class_location}</p>
          <h2 className="font-light mb-2">Class Start Time</h2>
          <p className="pb-4">{lauderdaleClass.class_start_time}</p>
          <h2 className="font-light mb-2">Class End Time</h2>
          <p className="pb-4">{lauderdaleClass.class_end_time}</p>
          <h2 className="font-light mb-2">Class Teacher</h2>
          <p className="pb-4">{teacherName(lauderdaleClass.class_teacher)}</p>
          <h2 className="font-light mb-2">Class Accompanist</h2>
          <p className="pb-4">
            {teacherName(lauderdaleClass.class_accompanist)}
          </p>

          <div className="mt-6">
            <button className="btn" onClick={() => handleOpenModal()}>
              Edit Class Info
            </button>
          </div>
        </div>
        <div className="mt-[3.75rem] ml-12">
          <h2 className="font-light mb-2">Class Students</h2>
          <table className="table table-xs">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {classStudents?.map((student, index) => {
                return (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      {student.first_name} {student.last_name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <dialog id="edit-class-modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => modalRef.current?.close()}
          >
            ✕
          </button>
          <div className="flex flex-col gap-3 ml-8">
            <input
              name="class_name"
              placeholder={lauderdaleClass.class_name}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="class_location"
              placeholder={lauderdaleClass.class_location}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="class_start_time">Start time</label>
            <input
              className="w-full max-w-xs"
              type="time"
              defaultValue={lauderdaleClass.class_start_time}
            />
            <label htmlFor="class_end_time">End time</label>
            <input
              type="time"
              defaultValue={lauderdaleClass.class_end_time}
              className="w-full max-w-xs"
            />
            <label htmlFor="class_teacher">Class Teacher</label>
            <select
              name="class_teacher"
              className="select select-bordered w-full max-w-xs"
            >
              <option>
                {
                  teacherData.filter(
                    (teacher: TeacherRecord) =>
                      teacher.id === lauderdaleClass.class_teacher
                  )[0]?.teacher_last_name
                }
              </option>
              {lauderdaleClass.class_teacher ? (
                teacherData
                  .filter(
                    (teacher: TeacherRecord) =>
                      teacher.id !== lauderdaleClass.class_teacher
                  )
                  .map((teacher: TeacherRecord) => {
                    return (
                      <option
                        value={teacher.id}
                        key={teacher.teacher_last_name}
                      >
                        {teacher.teacher_last_name}
                      </option>
                    );
                  })
              ) : (
                <option value="">Choose a teacher</option>
              )}
            </select>
            <label htmlFor="class_accompanist">Class accompanist</label>
            <select
              name="class_accompanist"
              className="select select-bordered w-full max-w-xs"
            >
              <option>
                {
                  teacherData.filter(
                    (teacher: TeacherRecord) =>
                      teacher.id === lauderdaleClass.class_accompanist
                  )[0]?.teacher_last_name
                }
              </option>
              {lauderdaleClass.class_accompanist ? (
                teacherData
                  .filter(
                    (teacher: TeacherRecord) =>
                      teacher.id !== lauderdaleClass.class_accompanist
                  )
                  .map((teacher: TeacherRecord) => {
                    return (
                      <option value={teacher.id} key={teacher.id}>
                        {teacher.teacher_last_name}
                      </option>
                    );
                  })
              ) : (
                <option value="">Choose an accompanist</option>
              )}
            </select>
            <label htmlFor="class_students">Class Students</label>
            {/* <Select /> */}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default LauderdaleClass;
