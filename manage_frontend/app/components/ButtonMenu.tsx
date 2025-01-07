import { Link } from "@remix-run/react";

type ButtonMenuProps = {
  setButtonMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ButtonMenu = ({ setButtonMenuOpen }: ButtonMenuProps) => {
  const handleMenuClick = () => {
    setButtonMenuOpen(false);
  };

  return (
    <ul
      className="menu bg-base-200 rounded-box w-56"
      onMouseLeave={handleMenuClick}
    >
      <li>
        <Link to={"/settings"} onClick={handleMenuClick}>
          Settings
        </Link>
      </li>
    </ul>
  );
};

export default ButtonMenu;
