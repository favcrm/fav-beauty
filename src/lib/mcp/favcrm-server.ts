import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod/v4";
import { FAVCRM_API_URL, type ProviderContext } from "$lib/data/config";
import { getClient } from "$lib/data/live/client";
import {
  getBrand,
  getEvent,
  getPost,
  getProduct,
  getTimeSlots,
  getTreatment,
  listEvents,
  listPosts,
  listProducts,
  listStylists,
  listTiers,
  listTreatments,
} from "$lib/data/provider";

type McpContext = ProviderContext & {
  origin: string;
  token?: string;
};

const optionalString = z.string().trim().optional();

function text(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function json(data: unknown) {
  return text(JSON.stringify(data, null, 2));
}

function sdk(ctx: McpContext) {
  const client = getClient(ctx);
  if (ctx.token) client.setToken(ctx.token);
  return client;
}

function requireToken(ctx: McpContext): string {
  if (!ctx.token) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "Customer authentication is required. Connect with a FavCRM customer bearer token.",
    );
  }
  return ctx.token;
}

function authInfo(ctx: McpContext): AuthInfo | undefined {
  if (!ctx.token) return undefined;
  return {
    token: ctx.token,
    clientId: "favcrm-customer-agent",
    scopes: ["customer"],
    resource: new URL(`${ctx.origin}/mcp`),
  };
}

export function createFavBeautyMcpServer(ctx: McpContext): McpServer {
  const server = new McpServer(
    {
      name: "favcrm-beauty-template-mcp",
      version: "0.1.0",
    },
    {
      instructions:
        "Use this server to read public beauty storefront content and perform customer-authorized booking, order, and invoice actions for the resolved FavCRM workspace. Merchant admin APIs are intentionally not exposed.",
    },
  );

  server.registerResource(
    "salon_profile",
    "favcrm://beauty/profile",
    {
      title: "Salon profile",
      description: "Public brand, contact, hours, and social profile.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(getBrand(ctx), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "treatments",
    "favcrm://beauty/treatments",
    {
      title: "Treatments",
      description: "Bookable services and treatment menu.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(await listTreatments(ctx), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "products",
    "favcrm://beauty/products",
    {
      title: "Retail products",
      description: "Public retail shop catalog.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(await listProducts(undefined, ctx), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "membership_tiers",
    "favcrm://beauty/memberships",
    {
      title: "Membership tiers",
      description: "Public membership plans and benefits.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(await listTiers(ctx), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "journal_post",
    new ResourceTemplate("favcrm://beauty/journal/{slug}", {
      list: async () => {
        const posts = await listPosts(ctx);
        return {
          resources: posts.map((post) => ({
            name: post.title,
            uri: `favcrm://beauty/journal/${post.slug}`,
            mimeType: "text/markdown",
            description: post.excerpt,
          })),
        };
      },
    }),
    {
      title: "Journal post",
      description: "Markdown view of a journal post.",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const slug = String(variables.slug ?? "");
      const post = await getPost(slug, ctx);
      if (!post) {
        throw new McpError(ErrorCode.InvalidParams, `Post not found: ${slug}`);
      }
      const markdown = `# ${post.title}

Published: ${post.publishedAt}
Category: ${post.category}
Original URL: ${ctx.origin}/journal/${post.slug}

${post.body || post.excerpt}
`;
      return {
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: markdown },
        ],
      };
    },
  );

  server.registerTool(
    "search_journal",
    {
      title: "Search journal",
      description:
        "Search public journal posts by title, excerpt, body, or category.",
      inputSchema: {
        query: optionalString,
        category: optionalString,
        limit: z.number().int().min(1).max(30).optional(),
      },
    },
    async ({ query, category, limit }) => {
      const needle = query?.toLowerCase();
      let posts = await listPosts(ctx);
      if (category) {
        posts = posts.filter((post) =>
          post.category.toLowerCase().includes(category.toLowerCase()),
        );
      }
      if (needle) {
        posts = posts.filter((post) =>
          [post.title, post.excerpt, post.body, post.category]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        );
      }
      return json(posts.slice(0, limit ?? 10));
    },
  );

  server.registerTool(
    "list_treatments",
    {
      title: "List treatments",
      description: "List public bookable treatments and services.",
      inputSchema: {
        category: optionalString,
        limit: z.number().int().min(1).max(50).optional(),
      },
    },
    async ({ category, limit }) => {
      let treatments = await listTreatments(ctx);
      if (category) {
        treatments = treatments.filter((treatment) =>
          treatment.category.toLowerCase().includes(category.toLowerCase()),
        );
      }
      return json(treatments.slice(0, limit ?? 50));
    },
  );

  server.registerTool(
    "get_treatment",
    {
      title: "Get treatment",
      description: "Fetch treatment details by id or slug.",
      inputSchema: { idOrSlug: z.string().trim().min(1) },
    },
    async ({ idOrSlug }) => {
      const treatment = await getTreatment(idOrSlug, ctx);
      if (!treatment) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Treatment not found: ${idOrSlug}`,
        );
      }
      return json(treatment);
    },
  );

  server.registerTool(
    "list_stylists",
    {
      title: "List stylists",
      description: "List staff and stylists available in the storefront.",
      inputSchema: {},
    },
    async () => json(await listStylists(ctx)),
  );

  server.registerTool(
    "get_booking_slots",
    {
      title: "Get booking slots",
      description: "List available booking slots for a treatment and date.",
      inputSchema: {
        treatmentId: z.string().trim().min(1),
        date: z.string().trim().min(1).describe("Date in YYYY-MM-DD format."),
        stylistId: optionalString,
      },
    },
    async ({ treatmentId, date, stylistId }) =>
      json(await getTimeSlots(treatmentId, date, stylistId, ctx)),
  );

  server.registerTool(
    "list_products",
    {
      title: "List products",
      description: "List public retail products.",
      inputSchema: {
        category: optionalString,
        limit: z.number().int().min(1).max(50).optional(),
      },
    },
    async ({ category, limit }) => {
      let products = await listProducts(undefined, ctx);
      if (category) {
        products = products.filter((product) =>
          product.category.toLowerCase().includes(category.toLowerCase()),
        );
      }
      return json(products.slice(0, limit ?? 50));
    },
  );

  server.registerTool(
    "get_product",
    {
      title: "Get product",
      description: "Fetch public product details by id or slug.",
      inputSchema: { idOrSlug: z.string().trim().min(1) },
    },
    async ({ idOrSlug }) => {
      const product = await getProduct(idOrSlug, ctx);
      if (!product) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Product not found: ${idOrSlug}`,
        );
      }
      return json(product);
    },
  );

  server.registerTool(
    "list_membership_tiers",
    {
      title: "List membership tiers",
      description: "List public membership tiers and benefits.",
      inputSchema: {},
    },
    async () => json(await listTiers(ctx)),
  );

  server.registerTool(
    "list_events",
    {
      title: "List events",
      description: "List public salon events.",
      inputSchema: { limit: z.number().int().min(1).max(30).optional() },
    },
    async ({ limit }) => json((await listEvents(ctx)).slice(0, limit ?? 30)),
  );

  server.registerTool(
    "get_event",
    {
      title: "Get event",
      description: "Fetch event details by slug.",
      inputSchema: { slug: z.string().trim().min(1) },
    },
    async ({ slug }) => {
      const event = await getEvent(slug, ctx);
      if (!event) {
        throw new McpError(ErrorCode.InvalidParams, `Event not found: ${slug}`);
      }
      return json(event);
    },
  );

  server.registerTool(
    "list_my_bookings",
    {
      title: "List my bookings",
      description: "List bookings for the authenticated customer.",
      inputSchema: {
        upcoming: z.enum(["true", "false"]).optional(),
        status: optionalString,
        limit: optionalString,
      },
    },
    async (args) => {
      requireToken(ctx);
      return json(await sdk(ctx).bookings.list(args));
    },
  );

  server.registerTool(
    "list_my_orders",
    {
      title: "List my orders",
      description: "List shop orders for the authenticated customer.",
      inputSchema: {},
    },
    async () => {
      requireToken(ctx);
      return json(await sdk(ctx).shop.listOrders());
    },
  );

  server.registerTool(
    "list_my_invoices",
    {
      title: "List my invoices",
      description: "List invoices for the authenticated customer.",
      inputSchema: {},
    },
    async () => {
      requireToken(ctx);
      return json(await sdk(ctx).invoices.list());
    },
  );

  server.registerTool(
    "create_contact_enquiry",
    {
      title: "Create contact enquiry",
      description: "Submit a customer enquiry to the salon inbox.",
      inputSchema: {
        name: z.string().trim().min(1),
        email: z.string().trim().email(),
        phone: optionalString,
        subject: optionalString,
        message: z.string().trim().min(1),
      },
    },
    async (input) => json(await sdk(ctx).contact.submit(input)),
  );

  server.registerTool(
    "create_guest_booking",
    {
      title: "Create guest booking",
      description: "Create a guest booking from a selected treatment slot.",
      inputSchema: {
        serviceId: z.string().trim().min(1),
        bookingDate: z.string().trim().min(1),
        startTime: z.string().trim().min(1),
        endTime: z.string().trim().min(1),
        scheduleId: optionalString,
        staffId: optionalString,
        resourceId: optionalString,
        quoteId: optionalString,
        notes: optionalString,
        addonIds: z.array(z.string().trim().min(1)).optional(),
      },
    },
    async (input) => json(await sdk(ctx).bookings.createGuest(input)),
  );

  server.registerTool(
    "create_order",
    {
      title: "Create order",
      description:
        "Create a retail order for the current customer or supplied customer details.",
      inputSchema: {
        lineItems: z
          .array(
            z.object({
              productId: z.number().int().positive(),
              quantity: z.number().int().positive(),
              variationId: z.number().int().positive().optional(),
            }),
          )
          .min(1),
        customerInfo: z.object({
          firstName: z.string().trim().min(1),
          lastName: z.string().trim().min(1),
          email: optionalString,
          phone: optionalString,
        }),
        shippingAddress: z.object({
          addressLine1: z.string().trim().min(1),
          addressLine2: optionalString,
          city: z.string().trim().min(1),
          state: optionalString,
          zipCode: optionalString,
          country: optionalString,
        }),
        shippingMethodId: z.number().int().positive().optional(),
        promotionCode: optionalString,
        paymentMethodId: optionalString,
        successUrl: optionalString,
        cancelUrl: optionalString,
      },
    },
    async (input) => json(await sdk(ctx).shop.createOrder(input)),
  );

  server.registerTool(
    "cancel_my_booking",
    {
      title: "Cancel my booking",
      description: "Cancel one booking owned by the authenticated customer.",
      inputSchema: {
        bookingId: z.string().trim().min(1),
        reason: optionalString,
      },
    },
    async ({ bookingId, reason }) => {
      requireToken(ctx);
      return json(await sdk(ctx).bookings.cancel(bookingId, reason));
    },
  );

  server.registerTool(
    "reschedule_my_booking",
    {
      title: "Reschedule my booking",
      description:
        "Reschedule one booking owned by the authenticated customer.",
      inputSchema: {
        bookingId: z.string().trim().min(1),
        bookingDate: z.string().trim().min(1),
        startTime: z.string().trim().min(1),
        endTime: z.string().trim().min(1),
        staffId: z.string().trim().nullable().optional(),
        resourceId: z.string().trim().nullable().optional(),
        notes: z.string().trim().nullable().optional(),
      },
    },
    async ({ bookingId, ...input }) => {
      requireToken(ctx);
      return json(await sdk(ctx).bookings.reschedule(bookingId, input));
    },
  );

  return server;
}

export function createAuthInfo(ctx: McpContext): AuthInfo | undefined {
  return authInfo(ctx);
}

export function authorizationServerUrl(): string {
  return FAVCRM_API_URL;
}
