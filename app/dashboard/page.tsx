"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard/home when component mounts
    router.push("/dashboard/home");
  }, [router]);

  // Return empty fragment as this page will redirect immediately
  return <></>;
}
