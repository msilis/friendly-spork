import { Form } from "@remix-run/react";
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
};

const AddFamily = () => {
  return (
    <div>
      <h1>Add Family Route</h1>
    </div>
  );
};

export default AddFamily;
