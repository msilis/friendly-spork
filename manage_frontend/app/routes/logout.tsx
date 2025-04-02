import {
  ActionFunction,
  LoaderFunction,
  redirectDocument,
  redirect,
} from "@remix-run/node";
import { destroySession, sessionStorage } from "~/utils/models/user.server";
import { Form } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  if (!session.has("login_session")) return redirect("/login");
  return Response.json(null);
};

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirectDocument("/login?index", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

const LogoutButton = () => {
  return (
    <Form action="/logout" method="post">
      <button className="btn btn-outline btn-secondary">Logout</button>
    </Form>
  );
};

export default LogoutButton;
