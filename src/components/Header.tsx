"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center max-w-screen-xl mx-auto bg-transparent text-white">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/assets/images/santoninocebu.png" alt="Santo Niño NZ logo" className="h-16 w-auto" />
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden flex items-center space-x-4">
        {onSearchChange && searchQuery !== undefined && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="p-2 rounded-full bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 w-24 sm:w-40"
            />
          </div>
        )}
        <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4 bg-white/5 backdrop-blur-md rounded-md p-2">
        <ul className="flex space-x-6 font-medium">
          <li><Link href="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-300 transition-colors duration-300">About Us</Link></li>
          <li><Link href="/about-sinulog" className="hover:text-gray-300 transition-colors duration-300">About Sinulog</Link></li>
          <li><Link href="/the-trust" className="hover:text-gray-300 transition-colors duration-300">The Trust</Link></li>
          <li><Link href="/projects" className="hover:text-gray-300 transition-colors duration-300">Projects</Link></li>
          <li><Link href="/join-us" className="hover:text-gray-300 transition-colors duration-300">Join Us</Link></li>
          <li><Link href="/donate" className="hover:text-gray-300 transition-colors duration-300">Donate</Link></li>
          <li><Link href="/contact" className="hover:text-gray-300 transition-colors duration-300">Contact</Link></li>
        </ul>
        {onSearchChange && searchQuery !== undefined && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="p-2 rounded-full bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 w-24 sm:w-40 md:w-48"
            />
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <ul className="flex flex-col space-y-6 text-xl font-medium">
            <li><Link href="/" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>About Us</Link></li>
            <li><Link href="/about-sinulog" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>About Sinulog</Link></li>
            <li><Link href="/the-trust" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>The Trust</Link></li>
            <li><Link href="/projects" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>Projects</Link></li>
            <li><Link href="/join-us" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>Join Us</Link></li>
            <li><Link href="/donate" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>Donate</Link></li>
            <li><Link href="/contact" className="hover:text-gray-300 transition-colors duration-300" onClick={toggleMobileMenu}>Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
