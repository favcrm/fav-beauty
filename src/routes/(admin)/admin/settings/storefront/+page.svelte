<script lang="ts">
  import { onMount } from "svelte";
  import {
    adminStorefrontDomainsApi,
    type StorefrontDomain,
  } from "$lib/api/admin";
  import ConfirmDialog from "$lib/components/admin/ConfirmDialog.svelte";
  import {
    Globe,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Loader2,
  } from "lucide-svelte";

  let domains = $state<StorefrontDomain[]>([]);
  let loading = $state(true);
  let loadError = $state("");

  let hostname = $state("");
  let adding = $state(false);
  let addError = $state("");

  let pendingDelete = $state<StorefrontDomain | null>(null);
  let deleting = $state(false);

  onMount(load);

  async function load() {
    loading = true;
    loadError = "";
    try {
      domains = await adminStorefrontDomainsApi.list();
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load domains";
    } finally {
      loading = false;
    }
  }

  async function add(e: Event) {
    e.preventDefault();
    addError = "";
    const value = hostname.trim();
    if (!value) {
      addError = "Enter a hostname.";
      return;
    }
    adding = true;
    try {
      await adminStorefrontDomainsApi.create(value);
      hostname = "";
      await load();
    } catch (err) {
      addError = err instanceof Error ? err.message : "Failed to register";
    } finally {
      adding = false;
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    deleting = true;
    try {
      await adminStorefrontDomainsApi.remove(pendingDelete.id);
      pendingDelete = null;
      await load();
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to remove";
    } finally {
      deleting = false;
    }
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
  }
</script>

<div class="mb-8">
  <div class="flex items-center gap-3 mb-2">
    <div
      class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"
    >
      <Globe class="w-4 h-4 text-slate-300" />
    </div>
    <h1 class="text-xl font-semibold text-gray-900">Storefront Domains</h1>
  </div>
  <p class="text-sm text-gray-500 ml-11">
    Hostnames your storefront is deployed at. A registered hostname lets the
    storefront resolve this workspace automatically — no companyId env var
    needed.
  </p>
</div>

<div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
  <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
    <h3 class="text-sm font-semibold text-gray-700">Register a hostname</h3>
  </div>

  <div class="p-6 space-y-5">
    <form onsubmit={add} class="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        bind:value={hostname}
        placeholder="shop.your-salon.com"
        autocomplete="off"
        class="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
      <button
        type="submit"
        disabled={adding}
        class="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800
               disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm
               font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {#if adding}
          <Loader2 class="w-4 h-4 animate-spin" />
          Registering…
        {:else}
          <Plus class="w-4 h-4" />
          Register
        {/if}
      </button>
    </form>

    {#if addError}
      <div
        class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
      >
        <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{addError}</span>
      </div>
    {/if}

    <div class="border-t border-gray-100 pt-5">
      {#if loading}
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 class="w-4 h-4 animate-spin" />
          Loading…
        </div>
      {:else if loadError}
        <div
          class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{loadError}</span>
        </div>
      {:else if domains.length === 0}
        <p class="text-sm text-gray-400">No hostnames registered yet.</p>
      {:else}
        <ul class="divide-y divide-gray-100">
          {#each domains as domain (domain.id)}
            <li class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3 min-w-0">
                <Globe class="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div class="min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate">
                    {domain.hostname}
                  </div>
                  <div class="text-xs text-gray-400">
                    Added {formatDate(domain.createdAt)}
                  </div>
                </div>
                {#if domain.verified}
                  <span
                    class="flex items-center gap-1 text-xs font-medium text-emerald-600"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    Verified
                  </span>
                {/if}
              </div>
              <button
                onclick={() => (pendingDelete = domain)}
                aria-label="Remove {domain.hostname}"
                class="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<ConfirmDialog
  open={pendingDelete !== null}
  title="Remove hostname?"
  message={pendingDelete
    ? `${pendingDelete.hostname} will no longer resolve to this workspace.`
    : ""}
  confirmLabel="Remove"
  confirmVariant="danger"
  loading={deleting}
  onConfirm={confirmDelete}
  onCancel={() => (pendingDelete = null)}
/>
