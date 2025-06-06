import {
  Link,
  useLoaderData,
  useParams,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import { useRef, useState } from "react";
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  getStudent,
  getTeachers,
  getFamilies,
  updateStudent,
  findStudentInClass,
} from "~/data/data.server";
import {
  ClassRecord,
  FamilyRecord,
  FetcherData,
  TeacherRecord,
} from "~/types/types";
import { useToast } from "~/hooks/hooks";
import { AlertContextType } from "~/contexts/alertContext";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (!intent)
    return Response.json({
      success: false,
      message: "Server error updating student",
    });
  const id = formData.get("id");
  const updateData = formData.get("update_data");

  if (
    typeof id === "string" &&
    typeof updateData === "string" &&
    id &&
    updateData
  ) {
    const parsedData = JSON.parse(updateData);
    try {
      const result = await updateStudent(parsedData, id);
      if (result?.success) {
        return Response.json({
          success: true,
          message: "Student info updated",
        });
      } else
        return Response.json({
          success: false,
          message: "Error updating student",
        });
    } catch (error) {
      console.error("Error updating student: ", error);
      Response.json({ success: false, message: "Error updating student" });
    }
  } else return Response.json({ success: false, message: "Invalid form data" });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [studentData, families, teachers, studentInClass] = await Promise.all([
    getStudent(params.id),
    getFamilies(),
    getTeachers(),
    findStudentInClass(params.id),
  ]);
  return Response.json({ studentData, families, teachers, studentInClass });
};

const Student = () => {
  const { studentData, families, teachers, studentInClass } =
    useLoaderData<typeof loader>();
  const student = studentData?.[0];
  const modalRef = useRef<HTMLDialogElement>(null);
  const [formState, setFormState] = useState({
    id: student.id,
    first_name: student.first_name,
    last_name: student.last_name,
    birthdate: student.birthdate,
    family_id: student.family_id,
    teacher_id: student.teacher_id,
  });

  const params = useParams();
  const revalidator = useRevalidator();
  const toast: AlertContextType = useToast();
  const fetcher = useFetcher<FetcherData>();

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  const handleModalClose = () => {
    modalRef.current?.close();
  };

  const handleSave = () => {
    let family = formState.family_id;
    let teacher = formState.teacher_id;
    if (formState.family_id) {
      family = Number(formState.family_id);
    }
    if (formState.teacher_id) {
      teacher = Number(formState.teacher_id);
    }
    if (
      typeof formState.id !== "number" ||
      typeof formState.first_name !== "string" ||
      typeof formState.last_name !== "string" ||
      typeof formState.birthdate !== "string" ||
      typeof family !== "number" ||
      typeof teacher !== "number"
    ) {
      toast.error("There was an error with the form");
      throw new Error("Invalid form data");
    }

    const updatedStudent = {
      first_name: formState.first_name,
      last_name: formState.last_name,
      birthdate: formState.birthdate,
      family_id: family,
      teacher_id: teacher,
    };

    if (updatedStudent !== undefined && params.id !== undefined) {
      fetcher.submit(
        {
          intent: "update",
          update_data: JSON.stringify(updatedStudent),
          id: params.id,
        },
        { method: "POST" }
      );
      revalidator.revalidate();
      fetcher.data?.success
        ? toast.success(fetcher?.data?.message || "Teacher updated")
        : toast.error("Error updating student");
      handleModalClose();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "family_id" || name === "teacher_id") {
      newValue = Number(value);
    }

    setFormState({ ...formState, [name]: newValue });
  };

  const isFormDirty =
    JSON.stringify(formState) !== JSON.stringify(student) ? true : false;

  return (
    <>
      <Link to={"/students"}>
        <button className="btn-link">Back</button>
      </Link>
      <div className="flex gap-12">
        <section className="ml-12 flex">
          <div>
            <h1 className="font-semibold text-lg pb-4 pt-4">Student info</h1>
            <h2 className="font-light mb-2">Student First Name</h2>
            <p className="pb-4">{student.first_name}</p>
            <h2 className="font-light mb-2">Student Last Name</h2>
            <p className="pb-4">{student.last_name}</p>
            <h2 className="font-light mb-2">Birthdate</h2>
            <p className="pb-4">{student.birthdate}</p>
            <h2 className="font-light mb-2">Family</h2>
            <p className="pb-4">
              {student.family_id
                ? families.filter(
                    (family: FamilyRecord) => family.id === student.family_id
                  )?.[0].family_last_name
                : "Not assigned"}
            </p>
            <h2 className="font-light mb-2">Teacher</h2>
            <p className="pb-4">
              {student.teacher_id
                ? teachers.filter(
                    (teacher: TeacherRecord) =>
                      teacher.id === student.teacher_id
                  )?.[0].teacher_last_name
                : "Not assigned"}
            </p>
            <button className="btn" onClick={() => handleOpenModal()}>
              Edit
            </button>
          </div>
        </section>
        <aside className="pt-4 ml-4">
          <h3 className="font-bold">Currently in the following classes:</h3>
          <ul className="pt-4">
            {Array.isArray(studentInClass) && studentInClass.length > 0 ? (
              studentInClass?.map((laudClass: ClassRecord) => {
                return (
                  <li key={laudClass?.id} className="font-light">
                    {laudClass?.class_name}
                  </li>
                );
              })
            ) : (
              <li className="font-light">No classes assigned</li>
            )}
          </ul>
        </aside>
      </div>

      <dialog id="student-edit-modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-6">Edit</h3>
          <div className="flex flex-col gap-3 ml-8">
            <input
              name="first_name"
              placeholder={student.first_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="last_name"
              placeholder={student.last_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="Birthdate">Birthdate</label>
            <input
              name="birthdate"
              defaultValue={student.birthdate}
              onChange={handleChange}
              type="date"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="family_id">Family</label>
            <select
              name="family_id"
              className="select select-bordered w-full max-w-xs"
              onChange={handleChange}
            >
              {student.family_id ? (
                <option value={student.family_id}>
                  {families.filter(
                    (family: FamilyRecord) => family.id === student.family_id
                  )[0]?.family_last_name || "Family not found"}
                </option>
              ) : (
                <option value="">Choose a family</option>
              )}

              {families
                .filter(
                  (family: FamilyRecord) => family.id !== student.family_id
                )
                .map((family: FamilyRecord) => {
                  return (
                    <option value={family.id} key={family.family_last_name}>
                      {family.family_last_name}
                    </option>
                  );
                })}
            </select>
            <label htmlFor="teacher_id">Teacher</label>
            <select
              name="teacher_id"
              className="select select-bordered w-full max-w-xs"
              onChange={handleChange}
            >
              {student.teacher_id ? (
                <option value={student.teacher_id}>
                  {
                    teachers.filter(
                      (teacher: TeacherRecord) =>
                        teacher.id === Number(student.teacher_id)
                    )?.[0].teacher_last_name
                  }
                </option>
              ) : (
                <option value="">Choose a teacher</option>
              )}

              {teachers
                .filter(
                  (teacher: TeacherRecord) => teacher.id !== student.teacher_id
                )
                .map((teacher: TeacherRecord) => {
                  return (
                    <option value={teacher.id} key={teacher.teacher_last_name}>
                      {teacher.teacher_last_name}
                    </option>
                  );
                })}
            </select>
          </div>
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
      </dialog>
    </>
  );
};

export default Student;
