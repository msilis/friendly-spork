import { useState } from "react";
import Menu from "./Menu";
import ButtonMenu from "./ButtonMenu";

type NavigationProps = {
  showLogout: boolean;
};

const Navigation = ({ showLogout }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonMenuOpen, setButtonMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleButtonMenu = () => {
    setButtonMenuOpen(!buttonMenuOpen);
  };

  return (
    <div className="navbar bg-base-300 relative">
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost"
          onClick={toggleMenu}
          data-testid="main-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        {menuOpen ? (
          <div className="absolute top-full left-0 z-50 mt-1">
            <Menu setMenuOpen={setMenuOpen} />
          </div>
        ) : null}
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/dashboard">
          Manage
        </a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost" onClick={toggleButtonMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
        {buttonMenuOpen ? (
          <div className="absolute top-full right-0 z-50 mt-1">
            <ButtonMenu
              setButtonMenuOpen={setButtonMenuOpen}
              showLogout={showLogout}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navigation;
