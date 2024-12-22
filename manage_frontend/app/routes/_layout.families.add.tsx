import { Form, Link } from "@remix-run/react";
import { useState } from "react";
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
  const parent1Address = body.get("parent1_address") as string | null;
  const parent2FirstName = body.get("parent2_first_name") as string | null;
  const parent2LastName = body.get("parent2_last_name") as string | null;
  const parent2Email = body.get("parent2_email") as string | null;
  const parent2MobilePhone = body.get("parent2_mobile_phone") as string | null;
  const parent2Address = body.get("parent2_address") as string | null;

  if (
    typeof familyLastName !== "string" ||
    typeof parent1FirstName !== "string" ||
    typeof parent1LastName !== "string" ||
    typeof parent1Email !== "string" ||
    typeof parent1MobilePhone !== "string"
  ) {
    throw new Error("Missing required fields!");
  }

  await addFamily({
    family_last_name: familyLastName,
    parent1_first_name: parent1FirstName,
    parent1_last_name: parent1LastName,
    parent1_email: parent1Email,
    parent1_mobile_phone: parent1MobilePhone,
    parent1_address: parent1Address,
    parent2_first_name: parent2FirstName,
    parent2_last_name: parent2LastName,
    parent2_email: parent2Email,
    parent2_mobile_phone: parent2MobilePhone,
    parent2_address: parent2Address,
  });

  return redirect("/families");
};

const AddFamily = () => {
  const [showSecondParent, setShowSecondParent] = useState(false);

  const handleSecondParentClick = () => {
    setShowSecondParent(!showSecondParent);
  };
  return (
    <div className="ml-8">
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
        <button
          type="button"
          className={`btn-neutral btn-ghost w-fit p-3 ${
            showSecondParent ? "hidden" : "block"
          }`}
          onClick={handleSecondParentClick}
        >
          Add Second Parent?
        </button>
        {showSecondParent ? (
          <>
            <input
              name="parent2_first_name"
              placeholder="Parent 2 First Name"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="parent2_last_name"
              placeholder="Parent 2 Last Name"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="parent2_email"
              placeholder="Parent 2 Email"
              type="email"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="parent2_mobile_phone"
              placeholder="Parent 2 Mobile Phone"
              type="tel"
              className="input input-bordered w-full max-w-xs"
            />
          </>
        ) : null}
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Family
        </button>
      </Form>
    </div>
  );
};

export default AddFamily;
