"use client";
import { createContext, useContext, useState } from "react";

const NavbarContext = createContext({ topOffset: 0, setTopOffset: () => {} });

export function NavbarProvider({ children }) {
  const [topOffset, setTopOffset] = useState(0);
  return (
    <NavbarContext.Provider value={{ topOffset, setTopOffset }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  return useContext(NavbarContext);
}
