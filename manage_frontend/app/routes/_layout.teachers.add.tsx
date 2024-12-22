import { Form, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { addTeacher } from "~/data/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const firstName = body.get("teacher_first_name");
  const lastName = body.get("teacher_last_name");
  const email = body.get("teacher_email");
  const phone = body.get("teacher_mobile_phone");
  const address = body.get("teacher_address");
  const isTeacherAccompanist = body.get("is_teacher_accompanist");

  let isAccompanist;
  if (isTeacherAccompanist === "on") {
    isAccompanist = 1;
  } else isAccompanist = 0;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof address !== "string"
  ) {
    throw new Error("Invalid form data");
  }
  await addTeacher({
    teacher_first_name: firstName,
    teacher_last_name: lastName,
    teacher_email: email,
    teacher_mobile_phone: phone,
    teacher_address: address,
    is_teacher_accompanist: isAccompanist,
  });

  return redirect("/teachers");
};

const AddTeacher = () => {
  return (
    <div>
      <Link to={"/teachers"}>
        <button className="btn-link">Back</button>
      </Link>
      <Form className="flex flex-col gap-3 ml-8" method="POST">
        <h2>Add Teacher</h2>
        <input
          name="teacher_first_name"
          placeholder="First Name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="teacher_last_name"
          placeholder="Last name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="teacher_email"
          placeholder="Email"
          type="email"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="teacher_mobile_phone"
          placeholder="Mobile Phone"
          type="tel"
          className="input input-bordered w-full max-w-xs"
        />
        <textarea
          name="teacher_address"
          placeholder="Address"
          className="textarea textarea-bordered textarea-lg w-full max-w-xs"
        />
        <label htmlFor="is_teacher_accompanist">
          Is this teacher an accompanist?
        </label>
        <input
          type="checkbox"
          name="is_teacher_accompanist"
          className="checkbox checkbox-accent"
        />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Teacher
        </button>
      </Form>
    </div>
  );
};

export default AddTeacher;
