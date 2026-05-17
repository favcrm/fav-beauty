/**
 * FavCRM SDK client factory for live mode.
 *
 * The workspace is resolved per request from the provider context (hostname
 * resolution wins, `VITE_FAVCRM_COMPANY_ID` is the fallback). `load` functions
 * pass `event.fetch` so requests correlate with the SvelteKit render;
 * interactive client-side calls fall back to `globalThis.fetch`.
 */
import { FavCRM } from "@favcrm/sdk";
import {
  FAVCRM_API_URL,
  resolveCompanyId,
  type ProviderContext,
} from "../config";

export function getClient(ctx?: ProviderContext): FavCRM {
  const companyId = resolveCompanyId(ctx);
  if (!companyId) {
    throw new Error(
      "getClient() called without a resolved workspace — live mode requires a companyId.",
    );
  }
  return new FavCRM({
    baseUrl: FAVCRM_API_URL,
    companyId,
    fetch: ctx?.fetch,
  });
}
