/**
 * Server hook: resolve this storefront deployment's FavCRM workspace from the
 * request hostname.
 *
 * Instead of every clone hard-coding a `VITE_FAVCRM_COMPANY_ID`, a deployment
 * can register its hostname in FavCRM (`storefront_domains`). This hook calls
 * the public resolve-domain endpoint, caches the result, and stashes the
 * resolved `companyId` on `event.locals` for `+layout.server.ts` to expose.
 *
 * `VITE_FAVCRM_COMPANY_ID` remains the fallback when the hostname is not
 * registered (or for local dev). Demo mode is still the default when neither
 * resolves.
 */
import type { Handle } from "@sveltejs/kit";
import { FAVCRM_API_URL, FAVCRM_COMPANY_ID } from "$lib/data/config";

/** How long a hostname → companyId resolution (hit or miss) is cached. */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Module-level cache so it is not a network round-trip per request. */
const cache = new Map<
  string,
  { companyId: string | null; expiresAt: number }
>();

/** Hosts that never resolve remotely — local development. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

/**
 * Resolve a hostname to a companyId via the FavCRM resolve-domain endpoint.
 * Returns `null` on any miss/error — never throws.
 */
async function resolveHostname(
  hostname: string,
  fetchFn: typeof fetch,
): Promise<string | null> {
  const cached = cache.get(hostname);
  if (cached && cached.expiresAt > Date.now()) return cached.companyId;

  let companyId: string | null = null;
  try {
    const url = `${FAVCRM_API_URL}/v6/customer-portal/storefront/resolve-domain?hostname=${encodeURIComponent(
      hostname,
    )}`;
    const res = await fetchFn(url);
    if (res.ok) {
      const body = (await res.json()) as {
        data?: { companyId?: string };
      };
      companyId = body.data?.companyId ?? null;
    }
  } catch {
    // Network/parse failure — treat as unresolved, fall back to env.
    companyId = null;
  }

  cache.set(hostname, { companyId, expiresAt: Date.now() + CACHE_TTL_MS });
  return companyId;
}

export const handle: Handle = async ({ event, resolve }) => {
  const hostname = event.url.hostname.toLowerCase();

  let resolved: string | null = null;
  if (!LOCAL_HOSTS.has(hostname)) {
    resolved = await resolveHostname(hostname, event.fetch);
  }

  event.locals.companyId = resolved ?? FAVCRM_COMPANY_ID ?? undefined;

  return resolve(event);
};
