import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center max-w-screen-xl mx-auto bg-transparent text-white">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/assets/images/santoninocebu.png" alt="Santo Niño NZ logo" className="h-16 w-auto" />
      </div>

      {/* Navigation and Search */}
      <nav className="flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-md p-2">
        <ul className="hidden md:flex space-x-6 font-medium">
          <li><Link href="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-300 transition-colors duration-300">About Us</Link></li>
          <li><Link href="/about-sinulog" className="hover:text-gray-300 transition-colors duration-300">About Sinulog</Link></li>
          <li><Link href="/events" className="hover:text-gray-300 transition-colors duration-300">Events</Link></li>
          <li><Link href="/contact" className="hover:text-gray-300 transition-colors duration-300">Contact</Link></li>
        </ul>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded-full bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 w-24 sm:w-40 md:w-48"
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
