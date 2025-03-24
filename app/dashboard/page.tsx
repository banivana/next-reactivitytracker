"use client";

import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard/home when component mounts
    router.push("/dashboard/home");
  }, [router]);

  // Return empty fragment as this page will redirect immediately
  return <></>;
}
