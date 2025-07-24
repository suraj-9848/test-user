"use client";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";
import { useEffect } from "react";

export default function AuthSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const { setJwt } = useJWT();

  useEffect(() => {
    // Do NOT setJwt from session.jwt! Only clear on logout.
    if (status === "unauthenticated") {
      setJwt(null);
    }
  }, [status, setJwt]);

  return <>{children}</>;
}
