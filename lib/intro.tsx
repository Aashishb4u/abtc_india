"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type IntroCtx = {
  ready: boolean;
  /** True once the blue intro screen has fully left. */
  cleared: boolean;
  setReady: (v: boolean) => void;
  setCleared: (v: boolean) => void;
};

const Ctx = createContext<IntroCtx>({
  ready: false,
  cleared: false,
  setReady: () => {},
  setCleared: () => {},
});

/** `ready` flips to true as the preloader lifts, which kicks off hero animations. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cleared, setCleared] = useState(false);
  const value = useMemo(() => ({ ready, cleared, setReady, setCleared }), [ready, cleared]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useIntro = () => useContext(Ctx);
