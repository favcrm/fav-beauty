import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

/** A writable store that mirrors itself to localStorage (browser only). */
export function persisted<T>(key: string, initial: T): Writable<T> {
  let start = initial;
  if (browser) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) start = JSON.parse(raw) as T;
    } catch {
      start = initial;
    }
  }

  const store = writable<T>(start);

  if (browser) {
    store.subscribe((value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable — keep working in memory */
      }
    });
  }

  return store;
}
