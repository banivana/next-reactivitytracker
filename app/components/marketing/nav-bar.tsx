"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-6 lg:px-8 bg-white">
      <Link
        className="flex items-center flex-shrink-0 cursor-pointer"
        href="#hero"
      >
        <svg
          width="58"
          height="51"
          viewBox="0 0 58 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto"
        >
          <path
            d="m31.6424 12.4379c-0.194 2.402 0.0197 4.8192 0.2468 7.2083c1.7834 13.0236 7.704 1.5823 5.4293 -9.4909"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m39.7444 8.44871c2.0633 -1.31488 16.2042 -11.02467 17.228 -6.03976c1.1128 5.41643 -10.2328 10.77135 -13.1562 14.32935c-6.4165 7.8092 -5.071 21.4153 -1.4807 30.155"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m28.7618 20.3423c-5.4138 7.7246 -8.8916 16.2553 -10.7349 25.2293"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m28.5156 35.3591c2.4708 -2.1985 8.7469 -0.444 7.2801 3.3641c-0.9479 2.4607 -3.5601 4.9262 -5.5526 6.6075c-0.7084 0.5977 -1.5844 1.2177 -2.4679 1.562c-0.2059 0.08 -0.7736 0.0878 -0.6171 0.2402c0.3552 0.3456 9.1734 -2.2382 9.6247 -0.4805c0.2052 0.7993 -6.4734 2.7261 -7.2802 2.8834c-4.1936 0.8165 -9.1933 0.6802 -12.8326 -1.6821c-0.8081 -0.5245 -1.0671 -1.7338 -1.7277 -2.1623c-0.0814 -0.053 -6.01008 4.4585 -9.11808 2.6429"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m41.5026 9.65137c0.1145 0.35263 0.405 0.62663 0.6441 0.90593"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m55.6079 2.26789c4.4761 -0.55898 -3.7977 3.60145 -0.2984 0.19369"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m40.3949 27.3106c-6.9318 0.9329 -9.1207 -0.0706 -11.3097 -8.5835c-6.5406 8.6583 -12.485 13.0582 -26.0852 12.6431c3.95343 2.1924 4.05427 3.7961 0 7.3933c3.39703 1.3266 2.78476 2.0703 0 3.397c3.04333 0.5776 4.05834 1.5188 4.97443 3.9964c1.65457 -1.7134 2.58287 -1.641 4.23747 0c8.3074 -9.0736 15.0946 -13.7171 28.183 -18.8463z"
            fill="#FFB915"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
        <span className="text-xl font-extrabold font-nunitoSans">
          <span className="text-[#FFB915]">Reactivity</span>Tracker
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-grow justify-center">
        <div className="flex items-center space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#about">About us</NavLink>
          <NavLink href="#contact">Support</NavLink>
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
              Support
            </NavLink>
            <Button
              variant="secondary"
              className=" bg-black text-white hover:bg-[#FDB813]/90 hover:text-black rounded-2xl font-ubuntu font-bold"
              onClick={() =>
                window.open("https://forms.gle/yy6R55PwBhrnuoD16", "_blank")
              }
            >
              Join Now!
            </Button>
          </div>
        </div>
      )}

      <div className="hidden lg:block w-[200px] text-right">
        <Button
          variant="secondary"
          className=" bg-black text-white hover:bg-[#FDB813]/90 hover:text-black rounded-2xl font-ubuntu font-bold"
          onClick={() =>
            window.open("https://forms.gle/yy6R55PwBhrnuoD16", "_blank")
          }
        >
          Join Now!
        </Button>
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
