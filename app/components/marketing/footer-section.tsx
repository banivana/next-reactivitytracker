"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="py-24 px-4 md:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg: justify-between items-center gap-10">
        <div className="mx-auto max-w-7xl flex flex-col items-center">
          <Link className="cursor-pointer" href="#hero">
            <Image
              src="/images/footer-visual.png"
              alt="Reactivity Tracker Logo"
              width={400}
              height={80}
            />
          </Link>
          <p className="ml-14 text-medium text-base-content-secondary font-baloo2">
            Help your clients with dog reactivity.
          </p>
          <div className="text-right mt-5">
            <a href="https://forms.gle/yy6R55PwBhrnuoD16" target="_blank">
              <Button
                variant="secondary"
                className=" bg-white border-1 border-black text-black hover:bg-[#FDB813]/90 rounded-2xl font-ubuntu"
              >
                Join Now!
              </Button>
            </a>
          </div>
        </div>
        <div className="mx-auto text-left">
          <h3 className="text-lg font-bold mb-4 font-notoSans">LINKS</h3>
          <nav className="flex flex-col gap-3">
            <Link
              href="#features"
              className="text-gray-600 hover:text-[#FDB813] transition-colors font-ubuntu"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-[#FDB813] transition-colors font-ubuntu"
            >
              About us
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-[#FDB813] transition-colors font-ubuntu"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
