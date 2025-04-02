import { Link } from "@remix-run/react";
import LogoutButton from "~/routes/logout";

type ButtonMenuProps = {
  setButtonMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLogout: boolean;
  handleLogout: () => void;
};

const ButtonMenu = ({ setButtonMenuOpen, showLogout }: ButtonMenuProps) => {
  const handleMenuClick = () => {
    setButtonMenuOpen(false);
  };

  const defaultThemeValue = () => {
    const storageValue = sessionStorage.getItem("colour-theme");
    if (storageValue === "dark") {
      return true;
    } else return false;
  };

  const handleColourThemeChange = (
    event: React.ChangeEvent<HTMLInputElement | undefined>
  ) => {
    if (event.target?.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.setAttribute("data-theme", "dark");
      sessionStorage.setItem("colour-theme", "dark");
      handleMenuClick();
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
      sessionStorage.setItem("colour-theme", "light");
      handleMenuClick();
    }
  };

  return (
    <ul
      className="menu bg-base-200 rounded-box w-56"
      onMouseLeave={handleMenuClick}
    >
      <li>
        <Link to={"/settings"} onClick={handleMenuClick} className="max-w-xs">
          Settings
        </Link>
      </li>
      <li className="flex flex-row cursor-default">
        <h2 className="font-bold">Set colour theme</h2>
        <p>Light</p>
        <input
          type="checkbox"
          checked={defaultThemeValue() ? defaultThemeValue() : false}
          value="dark"
          className="toggle theme-controller"
          onChange={(event) => handleColourThemeChange(event)}
        />
        <p>Dark</p>
      </li>
      <li>{showLogout && <LogoutButton />}</li>
    </ul>
  );
};

export default ButtonMenu;
