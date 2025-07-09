import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createUser } from "~/data/data.server";
import { useToast } from "~/hooks/hooks";
import { useEffect } from "react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  const passwordCheck = body.get("password-check");
  const errors: { password?: FormDataEntryValue; email?: FormDataEntryValue } =
    {};
  if (typeof email !== "string" || email === null || email.length == 0) {
    errors.email = "Invalid email or missing email";
  }
  if (
    typeof password !== "string" ||
    password === null ||
    password.length == 0
  ) {
    errors.password = "Password missing or invalid";
  }
  if (password !== passwordCheck) {
    errors.password = "Passwords do not match!";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors });
  }

  const emailString = email as string;
  const passwordString = password as string;

  await createUser({
    email: emailString,
    password: passwordString,
  });

  return redirect("/useradmin");
};

const CreateUser = () => {
  const actionData = useActionData<typeof action>();
  const toast = useToast();

  useEffect(() => {
    actionData?.errors?.email && toast.error(actionData.errors.email);
    actionData?.errors?.password && toast.error(actionData.errors.password);
    // Disabling dependencies for next line because adding in toast would cause endless re-renders, it handleShowStatusModal
    // doesn't need to run on revalidate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

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
        <input
          name="password-check"
          placeholder="Retype password"
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
