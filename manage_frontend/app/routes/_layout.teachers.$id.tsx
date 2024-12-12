import { LoaderFunctionArgs } from "@remix-run/node";
import { getTeacher, updateTeacher } from "~/data/data";
import {
  json,
  useLoaderData,
  useParams,
  Link,
  useRevalidator,
} from "@remix-run/react";
import { useRef, useState } from "react";
import { TeacherRecord } from "~/types/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [teacherData] = await getTeacher(params.id);
  return json(teacherData);
};

const Teacher = () => {
  const teacherData = useLoaderData<typeof loader>();
  const modalRef = useRef<HTMLDialogElement>(null);

  const [formState, setFormState] = useState<TeacherRecord>({
    id: teacherData.id,
    teacher_first_name: teacherData.teacher_first_name,
    teacher_last_name: teacherData.teacher_last_name,
    teacher_email: teacherData.teacher_email,
    teacher_mobile_phone: teacherData.teacher_mobile_phone,
    teacher_address: teacherData.teacher_address,
  });

  const params = useParams();
  const revalidator = useRevalidator();

  const handleModalOpen = () => {
    modalRef.current?.showModal();
  };

  const handleModalClose = () => {
    modalRef.current?.close();
  };

  const isFormDirty =
    JSON.stringify(formState) !== JSON.stringify(teacherData) ? true : false;

  const handleSave = () => {
    let teacherId = formState.id;
    if (formState.id) {
      teacherId = Number(formState.id);
    }
    if (
      typeof formState.id !== "number" ||
      typeof formState.teacher_first_name !== "string" ||
      typeof formState.teacher_last_name !== "string" ||
      typeof formState.teacher_email !== "string" ||
      typeof formState.teacher_mobile_phone !== "number" ||
      typeof formState.teacher_address !== "string"
    ) {
      throw new Error("Invalid form data");
    }

    updateTeacher(
      {
        id: teacherId,
        teacher_first_name: formState.teacher_first_name,
        teacher_last_name: formState.teacher_last_name,
        teacher_email: formState.teacher_email,
        teacher_mobile_phone: formState.teacher_mobile_phone,
        teacher_address: formState.teacher_address,
      },
      params.id
    );
    revalidator.revalidate();
    handleModalClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    if (name === "id" || name === "teacher_mobile_phone") {
      newValue = Number(value);
    }
    setFormState({ ...formState, [name]: newValue });
  };

  return (
    <>
      <Link to={"/teachers"}>
        <button className="btn-link">Back</button>
      </Link>
      <section className="ml-12 flex">
        <div>
          <h1 className="font-semibold text-lg pb-4 pt-4">Teacher info</h1>
          <h2 className="font-light mb-2">Teacher First Name</h2>
          <p className="pb-4">{teacherData.teacher_first_name}</p>
          <h2 className="font-light mb-2">Teacher Last Name</h2>
          <p className="pb-4">{teacherData.teacher_last_name}</p>
          <h2 className="font-light mb-2">Teacher Email</h2>
          <p className="pb-4">{teacherData.teacher_email}</p>
          <h2 className="font-light mb-2">Teacher Mobile Phone</h2>
          <p className="pb-4">{teacherData.teacher_mobile_phone}</p>
          <h2 className="font-light mb-2">Teacher Address</h2>
          <p className="pb-4">{teacherData.teacher_address}</p>
          <button className="btn" onClick={() => handleModalOpen()}>
            Edit
          </button>
        </div>
      </section>

      <dialog id="teacher-edit-modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-6">Edit</h3>
          <div className="flex flex-col gap-3 ml-8">
            <input
              name="teacher_first_name"
              placeholder={teacherData.teacher_first_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="teacher_last_name"
              placeholder={teacherData.teacher_last_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="teacher_email">Email</label>
            <input
              name="teacher_email"
              placeholder={teacherData.teacher_email}
              onChange={handleChange}
              type="email"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="teacher_mobile_phone">Mobile Phone</label>
            <input
              name="teacher_mobile_phone"
              placeholder={teacherData.teacher_mobile_phone}
              onChange={handleChange}
              type="tel"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="teacher_address">Address</label>
            <input
              name="teacher_address"
              placeholder={teacherData.teacher_address}
              onChange={handleChange}
              type="email"
              className="input input-bordered w-full max-w-xs"
            />
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

export default Teacher;
