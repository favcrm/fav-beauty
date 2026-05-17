import { writable } from "svelte/store";

export type Toast = {
  id: number;
  message: string;
  tone: "default" | "success" | "error";
};

let nextId = 1;

function createToasts() {
  const { subscribe, update } = writable<Toast[]>([]);

  function push(message: string, tone: Toast["tone"] = "default") {
    const id = nextId++;
    update((list) => [...list, { id, message, tone }]);
    setTimeout(() => {
      update((list) => list.filter((t) => t.id !== id));
    }, 4200);
  }

  return {
    subscribe,
    info: (m: string) => push(m, "default"),
    success: (m: string) => push(m, "success"),
    error: (m: string) => push(m, "error"),
    dismiss: (id: number) => update((list) => list.filter((t) => t.id !== id)),
  };
}

export const toasts = createToasts();
