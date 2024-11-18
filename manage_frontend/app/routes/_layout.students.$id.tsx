import { json, Link, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getStudent, getTeachers, getFamilies } from "~/data/data";
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const firstName = body.get("first_name");
  const lastName = body.get("last_name");
  const birthDate = body.get("birthdate");
  const family = Number(body.get("family"));
  const teacher = Number(body.get("teacher"));

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof birthDate !== "string" ||
    typeof family !== "number" ||
    typeof teacher !== "number"
  ) {
    throw new Error("Invalid form data");
  }
};

const Student = () => {
  const { studentData, families, teachers } = useLoaderData<typeof loader>();
  const student = studentData?.[0];
  const modalRef = useRef<HTMLDialogElement>(null);
  console.log(student);

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  const handleModalClose = () => {
    modalRef.current?.close();
  };

  const handleSave = () => {
    handleModalClose();
  };

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
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="Birthdate">Birthdate</label>
            <input
              name="birthdate"
              defaultValue={student.birthdate}
              type="date"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="family">Family</label>
            <select
              name="family"
              className="select select-bordered w-full max-w-xs"
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
            <label htmlFor="teacher">Teacher</label>
            <select
              name="teacher"
              className="select select-bordered w-full max-w-xs"
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
            className="btn btn-success mt-6"
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
