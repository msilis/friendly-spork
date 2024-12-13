import { Link } from "@remix-run/react";

type MenuProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Menu = ({ setMenuOpen }: MenuProps) => {
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
    </ul>
  );
};

export default Menu;
