import { get } from "svelte/store";
import { persisted } from "./persisted";

export type Account = {
  name: string;
  email: string;
  phone: string;
  tierId: string;
  joinedAt: string;
};

export type AuthState = {
  account: Account | null;
};

export const auth = persisted<AuthState>("lueur.auth", { account: null });

/**
 * Demo OTP sign-in. In demo mode any 6-digit code is accepted; the account is
 * stored client-side. Live mode (phase 2) swaps this for `sdk.auth.verifyOtp`.
 */
export function isValidOtp(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

export function signIn(email: string, name?: string) {
  const existing = get(auth).account;
  auth.set({
    account: {
      name: name || existing?.name || email.split("@")[0],
      email,
      phone: existing?.phone ?? "",
      tierId: existing?.tierId ?? "tier-essential",
      joinedAt: existing?.joinedAt ?? new Date().toISOString(),
    },
  });
}

export function updateAccount(patch: Partial<Account>) {
  auth.update((s) => (s.account ? { account: { ...s.account, ...patch } } : s));
}

export function signOut() {
  auth.set({ account: null });
}
