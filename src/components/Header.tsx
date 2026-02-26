import React, { useState } from "react";
import { useNavigation } from "../utils/navigation";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  menuItems?: { label: string; href: string }[];
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = "/icons/capitecLogo.svg",
  logoAlt = "Logo",
  menuItems = [
    { label: "Home", href: "/" },
    { label: "Disputes", href: "/disputes" },
    { label: "About", href: "/about" },
  ],
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { goTo, goHome } = useNavigation();
  const location = useLocation();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    goTo("/login");
  };

  return (
    <>
      <header className="bg-white w-full flex min-w-screen shadow-md relative z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              onClick={goHome}
              src={logoSrc}
              alt={logoAlt}
              className="h-8 w-auto cursor-pointer"
            />
          </div>

          <nav className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goTo(item.href)}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              data-testid="desktop-logout"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 z-50"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="px-4 py-16">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                goTo(item.href);
                setIsMenuOpen(false);
              }}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              className={`block w-full text-left py-3 transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            data-testid="mobile-logout"
            className="w-full text-left py-3 text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
