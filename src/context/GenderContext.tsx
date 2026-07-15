"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// The student-facing modules are anonymous (not tied to a logged-in siswa), so
// gender is a local UI preference used to pick which illustration set to show.
// If modules are ever tied to a real student record, source this from
// `imams.jenis_kelamin` instead (see plan / CLAUDE.md).
export type Gender = "male" | "female";

const STORAGE_KEY = "gema-gender";

// localStorage-backed store read via useSyncExternalStore — this keeps the
// value hydration-safe (server + first client render both use "male") without a
// setState-in-effect, and re-renders when the preference changes.
function readGender(): Gender {
  if (typeof window === "undefined") return "male";
  return window.localStorage.getItem(STORAGE_KEY) === "female" ? "female" : "male";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb); // sync across tabs
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

interface GenderContextValue {
  gender: Gender;
  setGender: (g: Gender) => void;
}

const GenderContext = createContext<GenderContextValue | null>(null);

export function GenderProvider({ children }: { children: ReactNode }) {
  const gender = useSyncExternalStore(subscribe, readGender, () => "male" as Gender);

  const setGender = useCallback((g: Gender) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, g);
    } catch {
      // Ignore write failures (e.g. Safari private mode).
    }
    emit(); // the "storage" event only fires in other tabs, so notify this one
  }, []);

  return (
    <GenderContext.Provider value={{ gender, setGender }}>
      {children}
    </GenderContext.Provider>
  );
}

export function useGender(): GenderContextValue {
  const ctx = useContext(GenderContext);
  if (!ctx) {
    throw new Error("useGender must be used within a GenderProvider");
  }
  return ctx;
}
