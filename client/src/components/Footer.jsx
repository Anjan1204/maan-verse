import React from 'react';
import { Link } from 'react-router-dom';
import {
  Github as GithubMahek,
  Github as GithubAnjan,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import Logo from './Logo';
import FacultyInquiryModal from './FacultyInquiryModal';

const Footer = () => {
  const [isInquiryModalOpen, setInquiryModalOpen] = React.useState(false);

  return (
    <footer className="bg-surface border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              MAAN-verse is your ultimate learning universe, designed to empower
              students and faculty with cutting-edge tools and premium courses.
              Unlock your potential today.
            </p>

            <div className="flex space-x-4">
              {[
                { Icon: GithubMahek, href: 'https://github.com/mahekshah429' },
                { Icon: GithubAnjan, href: 'https://github.com/_anjan_1211' },
                { Icon: Instagram, href: 'https://www.instagram.com/_anjan_1211?igsh=MXRtZmt2c2c1dTZqbQ==' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/in/mahek-shah-aab221317?' }
              ].map(({ Icon: _SocialIcon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <_SocialIcon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Courses', path: '/courses' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-secondary transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-secondary transition-colors"></span>
                  Become a Faculty
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              {[
                { name: 'Documentation', path: '/help' },
                { name: 'Help Center', path: '/help' },
                { name: 'Community', path: 'https://discord.gg/maanverse' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' }
              ].map((item) => (
                <li key={item.name}>
                  {item.path.startsWith('http') ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-secondary transition-colors"></span>
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-secondary transition-colors"></span>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={17} />
                </div>
                <span className="text-gray-400 text-sm italic">
                  Surat / Patna, India
                </span>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone size={16} />
                </div>
                <a
                  href="tel:+917632895266"
                  className="text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  +91 7632895266
                </a>
              </li>

              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={16} />
                </div>
                <a
                  href="mailto:maanverse85@gmail.com"
                  className="text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  maanverse85@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MAAN-verse LMS. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" /> for Smart Learning
          </p>
        </div>
      </div>

      <FacultyInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
