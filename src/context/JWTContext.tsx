"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface JWTContextType {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}

const JWTContext = createContext<JWTContextType>({
  jwt: null,
  setJwt: () => {},
});

export const useJWT = () => useContext(JWTContext);

export const JWTProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwtState] = useState<string | null>(null);

  // On mount, load JWT from localStorage
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (stored) setJwtState(stored);
  }, []);

  // When JWT changes, update localStorage
  const setJwt = (token: string | null) => {
    console.debug("[JWTContext] setJwt called with:", token);
    setJwtState(token);
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("jwt", token);
      } else {
        localStorage.removeItem("jwt");
      }
    }
  };

  return (
    <JWTContext.Provider value={{ jwt, setJwt }}>
      {children}
    </JWTContext.Provider>
  );
};
