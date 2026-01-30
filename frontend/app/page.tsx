"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { DesignaliCreative } from "@/components/creative";

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null; // or a loading spinner
  }

  return (
    <main className="overflow-hidden">
      <DesignaliCreative />
    </main>
  );
}
