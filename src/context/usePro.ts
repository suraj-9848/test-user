"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";

interface ProState {
  isProUser: boolean;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePro(): ProState {
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Bootstrap from cache to avoid flicker
  useEffect(() => {
    try {
      const isProLS =
        typeof window !== "undefined"
          ? localStorage.getItem("isProUser")
          : null;
      const expLS =
        typeof window !== "undefined"
          ? localStorage.getItem("proExpiresAt")
          : null;
      const expFuture = expLS ? new Date(expLS) > new Date() : false;

      if (isProLS === "1" || expFuture) {
        setIsProUser(true);
        setExpiresAt(expLS || null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionService.getCurrentSubscription();
      if (!mountedRef.current) return;
      const active = !!(
        data.isProUser &&
        (!data.expiresAt || new Date(data.expiresAt) > new Date())
      );
      setIsProUser(active);
      setExpiresAt(data.expiresAt || null);
      try {
        localStorage.setItem("isProUser", active ? "1" : "0");
        if (data.expiresAt)
          localStorage.setItem("proExpiresAt", data.expiresAt);
        else localStorage.removeItem("proExpiresAt");
      } catch {}
      setLoading(false);
    } catch (e: any) {
      if (!mountedRef.current) return;
      const msg = e?.message || "";
      if (
        msg.includes("Unauthorized") ||
        msg.includes("TOKEN_MISSING") ||
        msg.includes("401")
      ) {
        // Keep cached state when unauthorized
        setLoading(false);
        setError(null);
        return;
      }
      setError(typeof msg === "string" ? msg : "Failed to load Pro status");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { isProUser, expiresAt, loading, error, refresh };
}
