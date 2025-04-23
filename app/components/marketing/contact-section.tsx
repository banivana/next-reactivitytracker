"use client";

import { useEffect } from "react";

export function ContactSection() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://reactivitytracker.kit.com/a08330bc68/index.js";
    script.async = true;
    script.setAttribute("data-uid", "a08330bc68");

    const convertKitForm = document.getElementById("convertkit-form");
    if (convertKitForm) {
      convertKitForm.appendChild(script);
    }

    return () => {
      if (convertKitForm) {
        convertKitForm.removeChild(script);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      className="py-24 px-4 md:px-6 lg:px-8 bg-[#FFB915]/25 flex flex-col items-center"
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans mb-8">
          Be part of our Journey!
        </h2>
        {/* ConvertKit Newsletter Form */}
        <div id="convertkit-form" className="flex flex-col w-full"></div>
        {/* End of ConvertKit Newsletter Form */}
      </div>
    </section>
  );
}
