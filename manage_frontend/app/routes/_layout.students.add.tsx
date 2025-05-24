import { Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { addStudent, getFamilies } from "~/data/data.server";
import { FamilyRecord } from "~/types/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const firstName = body.get("first_name");
  const lastName = body.get("last_name");
  const birthDate = body.get("birthdate");
  const family = Number(body.get("family"));

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof birthDate !== "string" ||
    typeof family !== "number"
  ) {
    throw new Error("Invalid form data");
  }

  await addStudent({
    first_name: firstName,
    last_name: lastName,
    birthdate: birthDate,
    family_id: family,
  });

  return redirect("/students");
};

export const loader = async () => {
  return await getFamilies();
};

const AddStudent = () => {
  const familyLastNames = useLoaderData<typeof loader>();

  return (
    <div className="ml-8">
      <Link to={"/students"}>
        <button className="btn btn-sm mt-1 mb-1">
          <img
            src="../arrow-left.svg"
            alt="back-arrow"
            height="20"
            width="25"
          />
          Back
        </button>
      </Link>
      <Form className="flex flex-col gap-3 ml-8" method="POST">
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
        <label htmlFor="family">Family</label>
        <select
          name="family"
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">Choose a family</option>
          {familyLastNames.map((family: FamilyRecord) => {
            return (
              <option value={family.id} key={family.family_last_name}>
                {family.family_last_name}
              </option>
            );
          })}
        </select>
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Student
        </button>
      </Form>
    </div>
  );
};
export default AddStudent;
