import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";

type MenuProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("from the loader");
  const cookieHeader = request.headers.get("Cookie");
  console.log(cookieHeader);
  return Response.json(cookieHeader);
};

const Menu = ({ setMenuOpen }: MenuProps) => {
  const user = useLoaderData<typeof loader>();
  console.log(user);
  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <ul
      className="menu bg-base-200 rounded-box w-56"
      onMouseLeave={handleMenuClick}
    >
      <li>
        <Link to={"/families"} onClick={handleMenuClick}>
          Families
        </Link>
      </li>
      <li>
        <Link to={"/students"} onClick={handleMenuClick}>
          Students
        </Link>
      </li>
      <li>
        <Link to={"/teachers"} onClick={handleMenuClick}>
          Teachers
        </Link>
      </li>
      <li>
        <Link to={"/classes"} onClick={handleMenuClick}>
          Classes
        </Link>
      </li>
      <li>
        <Link to={"/reports"} onClick={handleMenuClick}>
          Reports
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
