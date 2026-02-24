
import React from 'react';

interface FooterProps {
  companyName?: string;
  logoSrc?: string;
  logoAlt?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const Footer: React.FC<FooterProps> = ({ 
  companyName = "Your Company", 
  logoSrc = "/icons/capitecLogo.svg", 
  logoAlt = "Company Logo" 
}) => {
  const socialLinks: SocialLink[] = [
    {
      platform: "Facebook",
      url: "https://facebook.com/yourcompany",
      icon: "📘"
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/yourcompany",
      icon: "🐦"
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/yourcompany",
      icon: "📷"
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/yourcompany",
      icon: "💼"
    }
  ];

  return (
    <footer className="bg-gray-800 flex w-full flex-col text-white py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Company Logo Section */}
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={logoSrc} 
            alt={logoAlt} 
            className="h-10 w-auto mr-3"
          />
          <span className="text-xl font-bold">{companyName}</span>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-blue-400 transition-colors duration-200"
              aria-label={`Visit our ${link.platform} page`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;