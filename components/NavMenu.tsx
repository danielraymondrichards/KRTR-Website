'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-6">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact Us</Link>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>


      {/* Mobile Nav Menu */}
      {open && (
        <div className="absolute bg-[#226CE0] top-10 right-0 rounded shadow-md p-4 space-y-2 md:hidden z-50">
          <Link href="/about" className="block hover:underline" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" className="block hover:underline" onClick={() => setOpen(false)}>Contact Us</Link>
        </div>
      )}
    </div>
  );
}
