import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getFirebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  cargando: boolean;
  emailVerificado: boolean;
  refrescar: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  cargando: true,
  emailVerificado: false,
  refrescar: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    let cancelar: (() => void) | undefined;

    void (async () => {
      try {
        const auth = await getFirebaseAuth();
        const { onAuthStateChanged } = await import("firebase/auth");
        if (!activo) return;
        cancelar = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setCargando(false);
        });
      } catch (e) {
        console.error("Firebase Auth no disponible", e);
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
      cancelar?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      cargando,
      emailVerificado: Boolean(user?.emailVerified),
      refrescar: async () => {
        const auth = await getFirebaseAuth();
        if (auth.currentUser) {
          await auth.currentUser.reload();
          setUser({ ...auth.currentUser } as User);
        }
      },
    }),
    [user, cargando],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
