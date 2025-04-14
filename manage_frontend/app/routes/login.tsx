import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { sessionStorage } from "~/utils/models/user.server";
import { redirect } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await authenticator.authenticate("email-pass", request);
    console.log(user, "user");
    if (user) {
      const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
      );
      session.set("user", user);
      const cookieHeader = await sessionStorage.commitSession(session);
      return redirect("/dashboard", {
        headers: { "Set-Cookie": cookieHeader },
      });
    }
  } catch (error) {
    console.log(request, "request");
    console.error("There was an error loggin in, ", error);
    return redirect("/login?=login_error");
  }
  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (user) throw redirect("/dashboard");
  return null;
};

const Login = () => {
  return (
    <main className="w-96 m-auto justify-center">
      <form className="flex flex-col" method="post">
        <h1 className="mt-4 font-bold text-4xl">/Manage</h1>
        <label htmlFor="email" className="mt-6">
          Email
        </label>
        <input
          name="email"
          className="input input-primary"
          required
          data-testid="email-input"
        />
        <label htmlFor="password" className="mt-5">
          Password
        </label>
        <input
          className="input input-primary"
          type="password"
          name="password"
          data-testid="password-input"
          required
        />
        <button className="btn btn-primary mt-4">Login</button>
      </form>
    </main>
  );
};

export default Login;
