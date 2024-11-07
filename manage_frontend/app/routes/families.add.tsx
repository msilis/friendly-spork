import { Form, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { addFamily } from "~/data/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const familyLastName = body.get("family_last_name");
  const parent1FirstName = body.get("parent1_first_name");
  const parent1LastName = body.get("parent1_last_name");
  const parent1Email = body.get("parent1_email");
  const parent1MobilePhone = body.get("parent1_mobile_phone");

  if (
    typeof familyLastName !== "string" ||
    typeof parent1FirstName !== "string" ||
    typeof parent1LastName !== "string" ||
    typeof parent1Email !== "string" ||
    typeof parent1MobilePhone !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  await addFamily({
    family_last_name: familyLastName,
    parent1_first_name: parent1FirstName,
    parent1_last_name: parent1LastName,
    parent1_email: parent1Email,
    parent1_mobile_phone: parent1MobilePhone,
  });

  return redirect("/families");
};

const AddFamily = () => {
  return (
    <div>
      <Link to={"/families"}>
        <button className="btn-link">Back</button>
      </Link>
      <Form className="flex flex-col gap-3" method="POST">
        <h2>Add Family</h2>
        <input
          name="family_last_name"
          placeholder="Family Last Name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="parent1_first_name"
          placeholder="Parent 1 First Name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="parent1_last_name"
          placeholder="Parent 1 Last Name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="parent1_email"
          placeholder="Parent 1 Email"
          type="email"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="parent1_mobile_phone"
          placeholder="Parent 1 Mobile Phone"
          type="tel"
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Family
        </button>
      </Form>
    </div>
  );
};

export default AddFamily;
