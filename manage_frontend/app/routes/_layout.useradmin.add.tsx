import { Form, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createUser } from "~/data/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid form data");
  }

  await createUser({
    email: email,
    password: password,
  });

  return redirect("/useradmin");
};

const CreateUser = () => {
  return (
    <div>
      <Link to={"/useradmin"}>
        <button className="btn-link">Back</button>
      </Link>
      <Form className="flex flex-col gap-3 ml-8" method="POST">
        <h2>Create user</h2>
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Create user
        </button>
      </Form>
    </div>
  );
};

export default CreateUser;
