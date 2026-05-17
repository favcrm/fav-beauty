/**
 * Live-mode configuration.
 *
 * Demo mode is the default: with no workspace resolved the storefront serves
 * seed data. A workspace can be supplied two ways, in priority order:
 *
 *   1. Resolved at request time from the deployment's own hostname (a
 *      `storefront_domains` row registered in FavCRM). Threaded through the
 *      provider via `ProviderContext.companyId`.
 *   2. The `VITE_FAVCRM_COMPANY_ID` build-time env var — the fallback.
 *
 * Either one switches the data provider to map live `@favcrm/sdk` responses.
 */

/** FavCRM API base URL — trailing slash stripped so paths compose cleanly. */
export const FAVCRM_API_URL = (
  (import.meta.env.VITE_FAVCRM_API_URL as string | undefined) ??
  "https://api.favcrm.io"
).replace(/\/$/, "");

/** Build-time workspace (company) UUID fallback. `undefined` in demo mode. */
export const FAVCRM_COMPANY_ID = import.meta.env.VITE_FAVCRM_COMPANY_ID as
  | string
  | undefined;

/**
 * Per-request provider context, threaded through every async provider
 * function by SvelteKit `load` functions and interactive components.
 *
 * - `fetch` — the SvelteKit `event.fetch`, so SDK requests correlate with the
 *   render. Falls back to `globalThis.fetch` for client-side interactive calls.
 * - `companyId` — the workspace resolved from the request hostname. Wins over
 *   the `VITE_FAVCRM_COMPANY_ID` env fallback.
 */
export type ProviderContext = { fetch?: typeof fetch; companyId?: string };

/**
 * Resolve the effective workspace UUID for a request.
 * Hostname-resolved companyId wins; the env var is the fallback.
 */
export function resolveCompanyId(ctx?: ProviderContext): string | undefined {
  return ctx?.companyId?.trim() || FAVCRM_COMPANY_ID?.trim() || undefined;
}

/** True once a non-empty workspace UUID is available for this request. */
export function isLive(ctx?: ProviderContext): boolean {
  return Boolean(resolveCompanyId(ctx));
}
