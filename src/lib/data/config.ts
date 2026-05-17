/**
 * Live-mode configuration.
 *
 * Demo mode is the default: with no env set the storefront serves seed data.
 * Supplying `VITE_FAVCRM_COMPANY_ID` switches the data provider to map live
 * `@favcrm/sdk` responses for that workspace.
 */

/** FavCRM API base URL — trailing slash stripped so paths compose cleanly. */
export const FAVCRM_API_URL = (
  (import.meta.env.VITE_FAVCRM_API_URL as string | undefined) ??
  "https://api.favcrm.io"
).replace(/\/$/, "");

/** Workspace (company) UUID. `undefined` in demo mode. */
export const FAVCRM_COMPANY_ID = import.meta.env.VITE_FAVCRM_COMPANY_ID as
  | string
  | undefined;

/** True once a non-empty workspace UUID has been supplied via env. */
export function isLiveConfigured(): boolean {
  return Boolean(FAVCRM_COMPANY_ID && FAVCRM_COMPANY_ID.trim());
}
