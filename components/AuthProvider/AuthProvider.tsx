"use client";

import { useEffect, useState } from "react";
import { clientAuthSession, clientGetMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const check = async () => {
      try {
        const session = await clientAuthSession();
        if (session) {
          const me = await clientGetMe();
          setUser(me);
        } else {
          clear();
        }
      } catch {
        clear();
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [setUser, clear]);

  if (checking)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return <>{children}</>;
}
