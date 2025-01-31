import React from "react";
import Image from "next/image";
import Logo from "../images/Logo.png";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center bg-indigo-500 h-screen w-64">
      <div className="mt-6 mx-6">
        <Image src={Logo} alt="logo" />
      </div>
      <div className="bg-slate-600 flex-col mx-14 my-8">
        <div className="bg-slate-500 mt-4">
          <a href="#" className=" hover:text-gray-300">
            Clients
          </a>
        </div>
        <div className="bg-slate-500 mt-4">
          <a href="#" className=" hover:text-gray-300">
            About
          </a>
        </div>
      </div>
    </div>
  );
}
