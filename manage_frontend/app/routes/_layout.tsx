import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Navigation from "~/components/Navigation";
import { sessionStorage } from "~/utils/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (!user) throw redirect("/login");
  return Response.json({ user });
};

const Layout = () => {
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <form style={{ display: "none" }} method="post" id="logout-form"></form>
      <Navigation showLogout={user?.user?.token ? true : false} />
      <main className="ml-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
