import {
  Link,
  useLoaderData,
  useRevalidator,
  useNavigate,
  useParams,
  useFetcher,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  getClass,
  getStudents,
  getTeachers,
  updateClass,
} from "~/data/data.server";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";
import Select, { MultiValue } from "react-select";
import { useClassContext } from "~/contexts/classContext";
import { useToast } from "~/hooks/hooks";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const updatedClass = formData.get("updated_class_data");
  const id = formData.get("id");
  if (!updatedClass)
    return Response.json({ success: false, message: "No info to update" });
  if (
    typeof updatedClass === "string" &&
    updatedClass &&
    typeof id === "string" &&
    id
  ) {
    try {
      const parsedData = JSON.parse(updatedClass);
      const result = await updateClass(parsedData, id);
      if (result?.success) {
        return Response.json({ success: true, message: "Class updated" });
      } else
        return Response.json({
          success: false,
          message: "Error updating class :/",
        });
    } catch (error) {
      console.error("There was an error updating class: ", error);
      return Response.json({ success: false, message: "Error updating class" });
    }
  } else
    Response.json({ success: false, message: "Server error updating class" });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [classData, studentData, teacherData] = await Promise.all([
    getClass(params.id),
    getStudents(),
    getTeachers(),
  ]);

  return Response.json({ classData, studentData, teacherData });
};

const LauderdaleClass = () => {
  const { classData, studentData, teacherData } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { setClassInformation, setStudentInformation, setTeacherInformation } =
    useClassContext();
  const lauderdaleClass: ClassRecord = classData?.[0];
  const [classStudents, setClassStudents] = useState<StudentRecord[]>();
  const [formState, setFormState] = useState({
    id: lauderdaleClass.id,
    class_name: lauderdaleClass.class_name,
    class_location: lauderdaleClass.class_location,
    class_start_time: lauderdaleClass.class_start_time,
    class_end_time: lauderdaleClass.class_end_time,
    class_students: lauderdaleClass.class_students,
    class_teacher: lauderdaleClass.class_teacher,
    class_accompanist: lauderdaleClass.class_accompanist,
  });
  const modalRef = useRef<HTMLDialogElement>(null);
  const params = useParams();
  const revalidator = useRevalidator();
  const toast = useToast();
  const fetcher = useFetcher();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    let newValue: string | number = value;
    if (
      name === "id" ||
      name === "class_teacher" ||
      name === "class_accompanist"
    ) {
      newValue = Number(value);
    }
    if (name === "class_start_time" || name === "class_end_time") {
      newValue = value.toString();
    }

    setFormState({ ...formState, [name]: newValue });
  };
  const handleSelectChange =
    (name: string) =>
    (newValue: MultiValue<{ value: number; label: string }>) => {
      const selectedOptions = newValue
        ? newValue.map((option) => option.value)
        : [];
      setFormState({ ...formState, [name]: selectedOptions });
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

  useEffect(() => {
    setClassInformation(lauderdaleClass);
    setStudentInformation(studentData);
    setTeacherInformation(teacherData);
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
    // eslint-disable-next-line
  }, [studentData, lauderdaleClass?.class_students]);

  const handleOpenModal = () => {
    setFormState({
      id: lauderdaleClass.id,
      class_name: lauderdaleClass.class_name,
      class_location: lauderdaleClass.class_location,
      class_start_time: lauderdaleClass.class_start_time,
      class_end_time: lauderdaleClass.class_end_time,
      class_students: lauderdaleClass.class_students,
      class_teacher: lauderdaleClass.class_teacher,
      class_accompanist: lauderdaleClass.class_accompanist,
    });

    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    modalRef.current?.close();
  };

  const handleCloseWithoutSave = () => {
    modalRef.current?.close();

    setFormState({
      id: lauderdaleClass.id,
      class_name: lauderdaleClass.class_name,
      class_location: lauderdaleClass.class_location,
      class_start_time: lauderdaleClass.class_start_time,
      class_end_time: lauderdaleClass.class_end_time,
      class_students: lauderdaleClass.class_students,
      class_teacher: lauderdaleClass.class_teacher,
      class_accompanist: lauderdaleClass.class_accompanist,
    });
  };

  const defaultOptions = formState.class_students.map((student) => ({
    value: student,
    label: `${
      studentData.filter(
        (studentRecord: StudentRecord) => studentRecord.id === Number(student)
      )[0]?.first_name
    } ${
      studentData.filter(
        (studentRecord: StudentRecord) => studentRecord.id === Number(student)
      )[0]?.last_name
    }`,
  }));

  const selectOptions = studentData.map((student: StudentRecord) => ({
    value: student.id,
    label: `${student.first_name} ${student.last_name}`,
  }));

  const isFormDirty =
    JSON.stringify(formState) !== JSON.stringify(lauderdaleClass)
      ? true
      : false;

  const handleSave = () => {
    let classTeacher = formState.class_teacher;
    let classAccompanist = formState.class_accompanist;
    if (formState.class_teacher) {
      classTeacher = Number(formState.class_teacher);
    }
    if (formState.class_accompanist) {
      classAccompanist = Number(formState.class_accompanist);
    }
    if (
      typeof formState.id !== "number" ||
      typeof formState.class_name !== "string" ||
      typeof formState.class_location !== "string" ||
      typeof formState.class_start_time !== "string" ||
      typeof formState.class_end_time !== "string" ||
      typeof formState.class_teacher !== "number" ||
      !(
        typeof formState.class_accompanist === "number" ||
        formState.class_accompanist === null
      )
    ) {
      throw new Error("Invalid form data");
    }
    const updatedClassInfo = {
      class_name: formState.class_name,
      class_location: formState.class_location,
      class_start_time: formState.class_start_time,
      class_end_time: formState.class_end_time,
      class_teacher: classTeacher,
      class_accompanist: classAccompanist,
      class_students: formState.class_students,
    };
    if (updatedClassInfo !== undefined && params.id !== undefined) {
      fetcher.submit(
        {
          updated_class_data: JSON.stringify(updatedClassInfo),
          id: params.id,
        },
        {
          method: "POST",
        }
      );
      revalidator.revalidate();
      handleCloseModal();
      toast.success("Class has been updated");
    } else toast.error("Error updating class info :/");
  };

  const handleRegisterClick = () => {
    navigate(`/classes/register/${lauderdaleClass.id}`);
  };

  const handleContactSheetClick = () => {
    navigate(`/classes/contact/${lauderdaleClass.id}`);
  };
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

          <div className="flex gap-6 mt-6">
            <button className="btn" onClick={() => handleOpenModal()}>
              Edit Class Info
            </button>
            <button className="btn" onClick={handleRegisterClick}>
              View Register
            </button>
            <button className="btn" onClick={handleContactSheetClick}>
              View Contact Sheet
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
                  <tr key={student?.id}>
                    <td>{index + 1}</td>
                    <td>
                      {student?.first_name} {student?.last_name}
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
            onClick={handleCloseWithoutSave}
          >
            ✕
          </button>
          <div className="flex flex-col gap-3 ml-8">
            <input
              name="class_name"
              defaultValue={formState.class_name}
              type="text"
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="class_location"
              defaultValue={formState.class_location}
              type="text"
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="class_start_time">Start time</label>
            <input
              className="w-full max-w-xs"
              name="class_start_time"
              type="time"
              onChange={handleChange}
              defaultValue={formState.class_start_time}
            />
            <label htmlFor="class_end_time">End time</label>
            <input
              type="time"
              name="class_end_time"
              defaultValue={formState.class_end_time}
              onChange={handleChange}
              className="w-full max-w-xs"
            />
            <label htmlFor="class_teacher">Class Teacher</label>
            <select
              name="class_teacher"
              onChange={handleChange}
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
                      teacher.id !== formState.class_teacher
                  )
                  .map((teacher: TeacherRecord) => {
                    return (
                      <option
                        value={teacher?.id}
                        key={`${teacher?.id}-${teacher?.teacher_last_name}`}
                      >
                        {teacher?.teacher_last_name}
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
              onChange={handleChange}
            >
              {formState.class_accompanist ? (
                <option>
                  {
                    teacherData.filter(
                      (teacher: TeacherRecord) =>
                        teacher.id === formState.class_accompanist
                    )[0]?.teacher_last_name
                  }
                </option>
              ) : (
                <option value="">Choose an accompanist</option>
              )}
              {teacherData
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
                })}
            </select>
            <label htmlFor="class_students">Class Students</label>
            <Select
              id="class_students"
              name="class_students"
              options={selectOptions}
              isMulti
              onChange={handleSelectChange("class_students")}
              defaultValue={defaultOptions}
              instanceId="class_student_select"
            />
            <button
              className={
                isFormDirty ? "btn btn-success mt-6" : "btn btn-disabled mt-6"
              }
              type="submit"
              onClick={() => handleSave()}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default LauderdaleClass;
