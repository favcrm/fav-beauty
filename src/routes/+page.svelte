<script lang="ts">
  import {
    featuredTreatments,
    featuredProducts,
    listTiers,
    listPosts,
    listTestimonials,
    getBrand,
  } from "$lib/data/provider";
  import { formatMoney, formatDate } from "$lib/format";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";
  import SectionHead from "$lib/components/SectionHead.svelte";
  import TreatmentCard from "$lib/components/TreatmentCard.svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";

  const brand = getBrand();
  const treatments = featuredTreatments();
  const products = featuredProducts().slice(0, 4);
  const glow = listTiers().find((t) => t.popular) ?? listTiers()[1];
  const posts = listPosts().slice(0, 3);
  const testimonials = listTestimonials();

  const marquee = [
    "Facials",
    "Hair Colour",
    "Bodywork",
    "Lash Couture",
    "Skin Coaching",
    "Atelier Manicure",
  ];
</script>

<!-- ── Hero ─────────────────────────────────────────────── -->
<section class="relative overflow-x-clip">
  <div
    class="bloom"
    style="width:34rem;height:34rem;top:-10rem;right:-9rem;background:radial-gradient(closest-side,rgba(219,147,140,0.62),transparent)"
  ></div>
  <div
    class="bloom"
    style="width:26rem;height:26rem;bottom:-8rem;left:-10rem;background:radial-gradient(closest-side,rgba(236,198,193,0.6),transparent);animation-delay:-9s"
  ></div>

  <div
    class="shell relative z-10 grid items-end gap-10 pb-20 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20"
  >
    <div class="reveal flex flex-col gap-6">
      <span class="eyebrow">{brand.city}</span>
      <h1 class="font-display text-display-xl text-ink">
        Beauty,<br />
        <span class="italic text-accent">unhurried.</span>
      </h1>
      <p class="max-w-md font-sans text-base leading-relaxed text-ink-soft">
        {brand.name} is a small atelier for considered skin, hair and body treatments
        — honest advice, quiet rooms, and a glow that lasts past the appointment.
      </p>
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <Button href="/treatments" size="lg">Book a treatment</Button>
        <a
          href="/membership"
          class="link-underline font-sans text-sm uppercase tracking-wide text-ink"
        >
          Explore membership
        </a>
      </div>
    </div>

    <div class="reveal relative">
      <div class="ml-auto w-[86%]">
        <Img src="/img/hero/atelier.webp" hue={14} label="Lueur Atelier" ratio="3 / 4" eager />
      </div>
      <div
        class="absolute -left-2 bottom-8 w-[52%] overflow-hidden rounded-petal border-4 border-paper shadow-soft"
      >
        <Img
          src="/img/hero/glow.webp"
          hue={344}
          label="Treatment Room"
          ratio="1 / 1"
          eager
          rounded={false}
        />
      </div>
      <div
        class="absolute -right-1 -top-5 hidden rounded-bloom bg-ink px-6 py-5 text-paper shadow-glow sm:block"
      >
        <div class="font-display text-3xl leading-none">12 yrs</div>
        <div
          class="mt-1 font-sans text-[0.6rem] uppercase tracking-wide text-blush"
        >
          in practice
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── Marquee ──────────────────────────────────────────── -->
<section class="border-y border-line bg-shell py-4">
  <div class="flex overflow-hidden">
    <div class="flex shrink-0 animate-marquee items-center">
      {#each [...marquee, ...marquee] as word, i (i)}
        <span class="flex items-center gap-8 px-8">
          <span class="font-display text-2xl italic text-ink">{word}</span>
          <span class="text-sm text-accent">✦</span>
        </span>
      {/each}
    </div>
  </div>
</section>

<!-- ── Featured treatments ──────────────────────────────── -->
<section class="shell py-20">
  <div class="flex flex-wrap items-end justify-between gap-6">
    <SectionHead
      eyebrow="The treatment menu"
      numeral="01"
      title="Signature rituals, by hand."
    />
    <a
      href="/treatments"
      class="link-underline font-sans text-sm uppercase tracking-wide text-ink"
    >
      All treatments
    </a>
  </div>
  <div class="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    {#each treatments as treatment, i (treatment.id)}
      <TreatmentCard {treatment} index={i} />
    {/each}
  </div>
</section>

<!-- ── Editorial split — soft rounded plum panel ────────── -->
<section class="shell pb-20">
  <div class="relative overflow-hidden rounded-bloom bg-ink text-paper">
    <div
      class="bloom"
      style="width:26rem;height:26rem;top:-9rem;right:-7rem;background:radial-gradient(closest-side,rgba(219,147,140,0.4),transparent)"
    ></div>
    <div
      class="relative z-10 grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16"
    >
      <div class="order-2 lg:order-1">
        <div class="grid grid-cols-2 gap-4">
          <Img hue={20} label="The Atelier" ratio="3 / 4" />
          <Img hue={336} label="Detail" ratio="3 / 4" class="mt-12" />
        </div>
      </div>
      <div class="order-1 flex flex-col gap-5 lg:order-2">
        <span class="eyebrow !text-blush">02 — The House</span>
        <h2 class="font-display text-display-md">
          A studio built around <span class="italic">restraint.</span>
        </h2>
        <p class="max-w-md font-sans leading-relaxed text-paper/70">
          We are not a fast salon. Every appointment begins with a reading — of
          your skin, your hair, the week you've had — and ends with a plan you
          can actually keep. Fewer products, clearer advice, better results.
        </p>
        <div class="mt-2 grid grid-cols-3 gap-6 border-t border-paper/15 pt-6">
          {#each [["4", "specialists"], ["6", "treatments"], ["98%", "return rate"]] as stat (stat[1])}
            <div>
              <div class="font-display text-4xl">{stat[0]}</div>
              <div
                class="mt-1 font-sans text-[0.62rem] uppercase tracking-wide text-paper/50"
              >
                {stat[1]}
              </div>
            </div>
          {/each}
        </div>
        <div class="pt-3">
          <Button href="/about" variant="outline" size="md">
            <span class="text-paper">Meet the atelier</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── Signature products ───────────────────────────────── -->
<section class="shell pb-20">
  <div class="flex flex-wrap items-end justify-between gap-6">
    <SectionHead
      eyebrow="Atelier shop"
      numeral="03"
      title="What we reach for."
    />
    <a
      href="/shop"
      class="link-underline font-sans text-sm uppercase tracking-wide text-ink"
    >
      Shop all
    </a>
  </div>
  <div class="mt-12 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
    {#each products as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</section>

<!-- ── Membership teaser ────────────────────────────────── -->
<section class="border-y border-line bg-bone">
  <div class="shell grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr]">
    <div class="flex flex-col gap-5">
      <span class="eyebrow">04 — Membership</span>
      <h2 class="font-display text-display-md text-ink">
        Make it a <span class="italic text-accent">practice.</span>
      </h2>
      <p class="max-w-md font-sans leading-relaxed text-ink-soft">
        The {glow.name} membership is built for the regular ritual — {formatMoney(
          glow.price,
          glow.currency,
        )} a month, and it pays for itself by the second visit.
      </p>
      <div class="pt-2">
        <Button href="/membership" size="md">View memberships</Button>
      </div>
    </div>
    <ul class="flex flex-col justify-center gap-2.5">
      {#each glow.benefits.slice(0, 4) as benefit (benefit)}
        <li
          class="flex items-start gap-3 rounded-petal bg-paper/70 px-5 py-3.5 font-sans text-sm text-ink shadow-soft"
        >
          <span class="mt-0.5 text-accent">✦</span>
          {benefit}
        </li>
      {/each}
    </ul>
  </div>
</section>

<!-- ── Testimonials ─────────────────────────────────────── -->
<section class="shell py-20">
  <SectionHead
    eyebrow="In their words"
    numeral="05"
    title="Kept by those who return."
  />
  <div class="mt-12 grid gap-8 lg:grid-cols-3">
    {#each testimonials as t (t.id)}
      <figure class="flex flex-col gap-5 rounded-bloom bg-bone p-8 shadow-soft">
        <span class="text-lg text-accent">✦</span>
        <blockquote class="font-display text-2xl italic leading-snug text-ink">
          "{t.quote}"
        </blockquote>
        <figcaption
          class="mt-auto font-sans text-[0.72rem] uppercase tracking-wide text-ink-faint"
        >
          {t.name} — {t.detail}
        </figcaption>
      </figure>
    {/each}
  </div>
</section>

<!-- ── Journal ──────────────────────────────────────────── -->
<section class="border-t border-line bg-bone">
  <div class="shell py-20">
    <div class="flex flex-wrap items-end justify-between gap-6">
      <SectionHead
        eyebrow="The journal"
        numeral="06"
        title="Notes from the atelier."
      />
      <a
        href="/journal"
        class="link-underline font-sans text-sm uppercase tracking-wide text-ink"
      >
        Read the journal
      </a>
    </div>
    <div class="mt-12 grid gap-8 lg:grid-cols-3">
      {#each posts as post (post.slug)}
        <a href={`/journal/${post.slug}`} class="group flex flex-col">
          <Img src={null} hue={post.hue} label={post.category} ratio="3 / 2" />
          <span
            class="mt-4 font-sans text-[0.66rem] uppercase tracking-wide text-accent"
          >
            {post.category} · {post.readMinutes} min
          </span>
          <h3
            class="mt-1.5 font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent"
          >
            {post.title}
          </h3>
          <span class="mt-2 font-sans text-[0.72rem] text-ink-faint">
            {formatDate(post.publishedAt)}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- ── Closing CTA ──────────────────────────────────────── -->
<section class="relative overflow-x-clip">
  <div
    class="bloom"
    style="width:30rem;height:30rem;top:-6rem;left:50%;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(236,198,193,0.55),transparent)"
  ></div>
  <div class="shell relative z-10 py-24">
    <div class="flex flex-col items-center gap-6 text-center">
      <span class="text-2xl text-accent">✦</span>
      <h2 class="max-w-3xl font-display text-display-lg text-ink">
        Book a treatment, or simply come in for a skin reading.
      </h2>
      <div class="flex flex-wrap justify-center gap-4 pt-2">
        <Button href="/treatments" size="lg">Book now</Button>
        <Button href="/contact" variant="outline" size="lg"
          >Ask a question</Button
        >
      </div>
    </div>
  </div>
</section>
