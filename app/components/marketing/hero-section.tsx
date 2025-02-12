"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative px-4 pt-10 pb-16 md:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl font-notoSans">
          Help your clients with{" "}
          <span className="inline-block bg-[#FDB813] px-4 py-2 mt-2">
            dog reactivity
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-baloo2">
          Every behavior tells a story—use data-driven insights to{" "}
          <span className="font-semibold">improve training</span> and{" "}
          <span className="font-semibold">enhance well-being</span>
        </p>

        <div className="mt-10">
          <a href="https://forms.gle/yy6R55PwBhrnuoD16" target="_blank">
            <Button className="rounded-2xl bg-black text-white hover:bg-[#FDB813] hover:text-black px-8 py-6 text-lg font-ubuntu font-bold">
              Join Early Access
            </Button>
          </a>
        </div>

        <div className="relative mt-16">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[1200px]">
              {/* Desktop Image */}
              <Image
                src="/images/hero-visual.png"
                alt="Reactivity Tracker Dashboard"
                width={1200}
                height={675}
                className="rounded-lg hidden md:block"
                priority
              />
              {/* Mobile Image */}
              <Image
                src="/images/hero-visual-mobile.png"
                alt="Reactivity Tracker Dashboard"
                width={1200}
                height={675}
                className="rounded-lg block md:hidden"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
