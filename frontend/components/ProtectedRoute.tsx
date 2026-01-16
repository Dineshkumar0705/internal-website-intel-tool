"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsAuthorized(false);
      router.replace("/access-denied");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // ⏳ Prevent flicker
  if (isAuthorized === null) return null;

  if (!isAuthorized) return null;

  return <>{children}</>;
}