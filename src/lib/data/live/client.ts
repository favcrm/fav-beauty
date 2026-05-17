/**
 * FavCRM SDK client factory for live mode.
 *
 * `load` functions pass `event.fetch` so requests are correlated with the
 * SvelteKit render; interactive client-side calls fall back to `globalThis.fetch`.
 */
import { FavCRM } from "@favcrm/sdk";
import { FAVCRM_API_URL, FAVCRM_COMPANY_ID } from "../config";

export function getClient(fetchFn?: typeof fetch): FavCRM {
  return new FavCRM({
    baseUrl: FAVCRM_API_URL,
    companyId: FAVCRM_COMPANY_ID!,
    fetch: fetchFn,
  });
}
