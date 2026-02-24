import React, { useState } from 'react';
import { useNavigation } from '../utils/navigation';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  menuItems?: { label: string; href: string }[];
}

const Header: React.FC<HeaderProps> = ({ 
  logoSrc = '/icons/capitecLogo.svg', 
  logoAlt = 'Logo', 
  menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Disputes', href: '/disputes' },
    { label: 'About', href: '/about' },
  ]
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
    goTo('/login');
  };

  return (
    <header className="bg-white flex min-w-screen shadow-md">
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
              className={`transition-colors duration-200 ${
                isActive(item.href) 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <nav className="px-4 py-2 bg-gray-50">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                goTo(item.href);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left py-2 transition-colors duration-200 ${
                isActive(item.href)
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
