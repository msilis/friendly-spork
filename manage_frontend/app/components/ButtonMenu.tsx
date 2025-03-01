import { Link } from "@remix-run/react";

type ButtonMenuProps = {
  setButtonMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ButtonMenu = ({ setButtonMenuOpen }: ButtonMenuProps) => {
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
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
      sessionStorage.setItem("colour-theme", "light");
    }
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
      <li className="flex flex-row">
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
    </ul>
  );
};

export default ButtonMenu;
