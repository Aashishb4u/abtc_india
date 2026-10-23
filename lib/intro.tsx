"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type IntroCtx = { ready: boolean; setReady: (v: boolean) => void };

const Ctx = createContext<IntroCtx>({ ready: false, setReady: () => {} });

/** `ready` flips to true as the preloader lifts, which kicks off hero animations. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useIntro = () => useContext(Ctx);
