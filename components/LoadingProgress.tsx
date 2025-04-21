"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "./nprogress.css";

// Configure NProgress
NProgress.configure({
  minimum: 0.15,
  easing: "ease",
  speed: 300,
  showSpinner: false,
  trickleSpeed: 150,
});

export function LoadingProgress() {
  const pathname = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStop = () => {
      NProgress.done();
    };
    handleStop();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Attach event listeners for clicking links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !anchor.hasAttribute("download")
      ) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      NProgress.done();
    };
  }, []);

  return null;
}
