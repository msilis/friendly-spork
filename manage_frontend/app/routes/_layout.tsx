import { Outlet } from "@remix-run/react";
import Navigation from "~/components/Navigation";

const Layout = () => {
  return (
    <div>
      <Navigation />
      <main className="ml-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
