import { CopyrightIcon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import React from 'react';

interface FooterProps {
  companyName?: string;
  logoSrc?: string;
  logoAlt?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Footer: React.FC<FooterProps> = ({ 
  companyName = "Capitec Bank", 
  logoSrc = "/icons/capitecLogoB&W.svg", 
  logoAlt = "Company Logo" 
}) => {
  const socialLinks: SocialLink[] = [
    {
      platform: "Facebook",
      url: "https://facebook.com/yourcompany",
      icon: Facebook
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/yourcompany",
      icon: Twitter
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/yourcompany",
      icon: Instagram
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/yourcompany",
      icon: Linkedin
    }
  ];

  return (
    <footer className="bg-gray-800 flex min-w-screen flex-col text-white py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Company Logo Section */}
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={logoSrc} 
            alt={logoAlt} 
            className="h-10 w-auto mr-3"
          />
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors duration-200"
                aria-label={`Visit our ${link.platform} page`}
              >
                <IconComponent className="w-6 h-6" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Scam Warning Section */}
        <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-700">
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 text-center">
                <p className="font-semibold text-yellow-200 mb-2">⚠️ Beware of Scams</p>
                <p className="text-sm text-gray-300">
                We will never ask for your PIN, password, or OTP via email, SMS, or phone call. 
                If you're uncertain about any communication, contact us directly at 0860 10 20 43 or visit your nearest branch.
                </p>
            </div>
        </div>

      {/* Copyright Section */}
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
        <p><CopyrightIcon className="inline mr-2" /> {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
