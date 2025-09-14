"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-6 lg:px-8 bg-white">
      <Link
        className="flex items-center flex-shrink-0 cursor-pointer"
        href="#hero"
      >
        <Logo className="h-8 w-auto" />
        <span className="text-xl font-extrabold font-nunitoSans">
          <span className="text-[#FFB915]">Reactivity</span>Tracker
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-grow justify-center">
        <div className="flex items-center space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#about">About us</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 hover:text-gray-900"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
          <div className="flex flex-col items-center py-4 space-y-4">
            <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>
              Features
            </NavLink>
            <NavLink href="#about" onClick={() => setIsMenuOpen(false)}>
              About us
            </NavLink>
            <NavLink href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </NavLink>
            <a href="https://reactivitytracker.kit.com/apptest" target="_blank">
              <Button
                variant="secondary"
                className=" bg-black text-white hover:bg-[#FDB813]/90 hover:text-black rounded-2xl font-ubuntu font-bold"
              >
                Join Now!
              </Button>
            </a>
          </div>
        </div>
      )}

      <div className="hidden lg:block w-[200px] text-right">
        <a href="https://reactivitytracker.kit.com/apptest" target="_blank">
          <Button
            variant="secondary"
            className=" bg-black text-white hover:bg-[#FDB813]/90 hover:text-black rounded-2xl font-ubuntu font-bold"
          >
            Join Now!
          </Button>
        </a>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-gray-900 font-ubuntu"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
