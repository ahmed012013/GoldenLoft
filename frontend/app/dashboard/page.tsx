"use client";

import { DesignaliCreative } from "@/components/creative";
import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    // If we land here, we assume authorized until an API call fails with 401
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  return <DesignaliCreative />;
}
