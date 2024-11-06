import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { addStudent } from "~/data/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const firstName = body.get("first_name");
  const lastName = body.get("last_name");
  const birthDate = body.get("birthdate");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof birthDate !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  await addStudent({
    first_name: firstName,
    last_name: lastName,
    birthdate: birthDate,
  });

  return redirect("/students");
};

const AddStudent = () => {
  return (
    <div>
      <div>Add Student Route</div>
      <Form className="flex flex-col gap-3" method="POST">
        <h2>Add Student</h2>
        <input
          name="first_name"
          placeholder="First Name"
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
          type="date"
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Student
        </button>
      </Form>
    </div>
  );
};
export default AddStudent;
