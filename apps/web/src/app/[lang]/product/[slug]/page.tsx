import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import Link from "@/components/link";
import { ProductGrid } from "@/components/product-grid";
import { SharePanel } from "@/components/share-panel";
import { Badge, Media, SectionHeading, formatPrice } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getCompany, getProduct, getProducts } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { Product } from "@/lib/types";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const products = await getProducts(params.lang as Locale);
  return products.map((p) => ({ slug: p.slug }));
}

function productKeywords(p: Product) {
  return [...new Set([p.brandName, p.collection?.name, ...(p.tags ?? []), ...(p.badges ?? [])].filter(Boolean) as string[])];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[slug]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const product = await getProduct(lang, (await params).slug);
  if (!product) return { title: dict.product.notFound };
  const title = product.brandName ? `${product.name} | ${product.brandName}` : product.name;
  const description = product.description ?? dict.product.orderText;
  const keywords = productKeywords(product);
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { languages: { th: `/th/product/${product.slug}`, en: `/en/product/${product.slug}` } },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${lang}/product/${product.slug}`,
      images: product.imageUrl ? [absoluteUrl(product.imageUrl)] : undefined,
    },
  };
}

/** schema.org data so Google and AI assistants know the product, brand, collection, tags and price. */
function jsonLd(product: Product, lang: Locale) {
  const url = `${SITE_URL}/${lang}/product/${product.slug}`;
  const price = product.salePrice ?? product.price;
  const keywords = productKeywords(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    url,
    inLanguage: lang === "th" ? "th-TH" : "en-US",
    image: product.imageUrl ? [absoluteUrl(product.imageUrl)] : undefined,
    brand: product.brandName ? { "@type": "Brand", name: product.brandName } : undefined,
    category: product.collection?.name || undefined,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "THB",
      price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "BeautyUp Enterprise", url: SITE_URL },
    },
  };
}

/** Where the brand's products are listed on the site. */
const brandHref = (p: Product) => (p.brandType === "SALON" ? `/products/${p.brandSlug}` : "/shop");

export default async function ProductPage({ params }: PageProps<"/[lang]/product/[slug]">) {
  const { lang, dict } = await resolveLang(params);
  const { slug } = await params;
  const product = await getProduct(lang, slug);
  if (!product) notFound();
  const d = dict.product;

  const pageUrl = `${SITE_URL}/${lang}/product/${product.slug}`;
  const [company, sameBrand, qr] = await Promise.all([
    getCompany(lang),
    getProducts(lang, { brandSlug: product.brandSlug }),
    QRCode.toDataURL(pageUrl, { width: 480, margin: 1 }),
  ]);
  const related = sameBrand.filter((p) => p.slug !== product.slug).slice(0, 4);
  const price = product.salePrice ?? product.price;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(product, lang)).replace(/</g, "\\u003c") }} />
      <article className="container-page py-8 md:py-14">
        <nav aria-label={dict.common.breadcrumb} className="mb-6 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <Link href={product.brandType === "SALON" ? "/products" : "/shop"} className="hover:text-ink">
            {product.brandType === "SALON" ? dict.products.title : dict.shop.title}
          </Link>
          <span>/</span>
          {product.brandName && (
            <>
              <Link href={brandHref(product)} className="hover:text-ink">
                {product.brandName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-3xl md:sticky md:top-28 md:self-start">
            <Media src={product.imageUrl} alt={product.name} label={product.brandName} className="aspect-square w-full" />
            {product.badges?.length ? (
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {product.brandName && (
              <Link href={brandHref(product)} className="eyebrow transition-colors hover:text-accent-dark">
                {product.brandName}
              </Link>
            )}
            <h1 className="mt-3 font-display text-3xl leading-tight text-balance sm:text-5xl">{product.name}</h1>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
              <span className="sr-only">{d.price}</span>
              <span className={`font-display text-3xl sm:text-4xl ${product.salePrice ? "text-accent" : ""}`}>{formatPrice(price)}</span>
              {product.salePrice && <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>}
            </p>

            {product.description && (
              <div className="mt-6 space-y-3 text-muted">
                {product.description.split("\n").filter(Boolean).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-line bg-mist p-6">
              <p className="font-medium">{d.orderTitle}</p>
              <p className="mt-1 text-sm text-muted">{d.orderText}</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link href={`/contact/salon-partner?product=${encodeURIComponent(product.name)}`} className="btn btn-primary">
                  <MessageCircle className="size-4" />
                  {dict.common.contactToOrder}
                </Link>
                {company.phones[0] && (
                  <a href={`tel:${company.phones[0].replaceAll("-", "")}`} className="btn btn-outline">
                    <Phone className="size-4" />
                    {d.call} {company.phones[0]}
                  </a>
                )}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-xs font-medium tracking-wide text-muted uppercase">{dict.members.tags}</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                  {product.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-sand px-3 py-1">#{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            <SharePanel url={pageUrl} qr={qr} fileName={`${product.slug}-qr.png`} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section border-t border-line">
          <div className="container-page">
            <SectionHeading
              title={d.related}
              action={
                product.brandName && (
                  <Link href={brandHref(product)} className="inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-accent">
                    {d.allFromBrand(product.brandName)} →
                  </Link>
                )
              }
            />
            <ProductGrid products={related} brandNames={{ [product.brandSlug]: product.brandName ?? "" }} showFilter={false} />
          </div>
        </section>
      )}
    </>
  );
}
