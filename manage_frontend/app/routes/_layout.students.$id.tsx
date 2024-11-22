import { json, Link, useLoaderData, useParams } from "@remix-run/react";
import { useRef, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  getStudent,
  getTeachers,
  getFamilies,
  updateStudent,
} from "~/data/data";
import { FamilyRecord, TeacherRecord } from "~/types/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // return await getStudent(params.id);
  const [studentData, families, teachers] = await Promise.all([
    getStudent(params.id),
    getFamilies(),
    getTeachers(),
  ]);
  return json({ studentData, families, teachers });
};

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const body = await request.formData();
//   const id = body.get("id");
//   const firstName = body.get("first_name");
//   const lastName = body.get("last_name");
//   const birthDate = body.get("birthdate");
//   const family = Number(body.get("family"));
//   const teacher = Number(body.get("teacher"));

//   if (
//     typeof id !== "number" ||
//     typeof firstName !== "string" ||
//     typeof lastName !== "string" ||
//     typeof birthDate !== "string" ||
//     typeof family !== "number" ||
//     typeof teacher !== "number"
//   ) {
//     throw new Error("Invalid form data");
//   }

//   await updateStudent({
//     id: id,
//     first_name: firstName,
//     last_name: lastName,
//     birthdate: birthDate,
//     family_id: family,
//     teacher_id: teacher,
//   });
// };

const Student = () => {
  const { studentData, families, teachers } = useLoaderData<typeof loader>();
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

  console.log(formState, "formState");

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
      throw new Error("Invalid form data");
    }
    updateStudent(
      {
        id: formState.id,
        first_name: formState.first_name,
        last_name: formState.last_name,
        birthdate: formState.birthdate,
        family_id: family,
        teacher_id: teacher,
      },
      params.id
    );
    handleModalClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
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
            {student.family_id ? student.family_id : "Not assigned"}
          </p>
          <h2 className="font-light mb-2">Teacher</h2>
          <p className="pb-4">
            {student.teacher_id ? student.teacher_id : "Not assigned"}
          </p>
          <button className="btn" onClick={() => handleOpenModal()}>
            Edit
          </button>
        </div>
      </section>

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
              <option value="">Choose a family</option>
              {families.map((family: FamilyRecord) => {
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
              <option value="">Choose a teacher</option>
              {teachers.map((teacher: TeacherRecord) => {
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
