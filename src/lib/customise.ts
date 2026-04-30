"use client";

import { useSyncExternalStore } from "react";

export type CustomiseState = {
  font: string;
  color: string;
};

const subscribers = new Set<() => void>();
let state: CustomiseState = { font: "sans", color: "light" };

export function getCustomise(): CustomiseState {
  return state;
}

export function setCustomise(updates: Partial<CustomiseState>): void {
  state = { ...state, ...updates };
  subscribers.forEach((fn) => fn());
}

export function useCustomise(): CustomiseState {
  return useSyncExternalStore(
    (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    () => state,
    () => state
  );
}
