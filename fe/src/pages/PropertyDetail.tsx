import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaCar,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaFlag,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShareAlt,
  FaStar,
  FaTimes,
  FaWhatsapp,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import AdSlot from '@/components/ads/AdSlot';
import SubscriberBadge from '@/components/brand/SubscriberBadge';
import SafetyTips from '@/components/trust/SafetyTips';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';
import { PROPERTY_SERVICE } from '@/services/property';
import { getApiBaseUrl } from '@/services/api';
import { API } from '@/services/api';
import { PropertyFormData } from '@/types/property';
import { useToast } from '@/hooks/useToast';
import { MEDIA, galleryAt } from '@/data/media';
import { buildSeoPath, labelToSlug } from '@/lib/seo';
import { getDemoListingById, type DemoListing } from '@/data/demo-listings';

const FALLBACK_MEDIA = [
  MEDIA.duplex,
  MEDIA.pool,
  MEDIA.interior,
  MEDIA.apartment,
  MEDIA.kitchen,
  MEDIA.terrace,
];

const REPORT_REASONS = [
  'Suspected scam / fraud',
  'Misleading photos or price',
  'Property already sold/rented',
  'Wrong location or details',
  'Inappropriate content',
  'Other',
];

const isLandType = (type: string, purpose: string) => {
  const t = type.toLowerCase();
  return t.includes('land') || purpose === 'lease' || t.includes('plot');
};

type PublicReview = {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt?: string;
};

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const toast = useToast();
  const [apiProperty, setApiProperty] = useState<PropertyFormData | null>(null);
  const [demoListing, setDemoListing] = useState<DemoListing | null>(null);
  const [demoMissing, setDemoMissing] = useState(false);
  const [mainIdx, setMainIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [badge, setBadge] = useState<{ badgeLabel?: string | null; badgeColor?: string | null }>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [reportOpen, setReportOpen] = useState(false);
  const [reportBusy, setReportBusy] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: REPORT_REASONS[0], email: '', details: '' });
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, body: '' });
  const [reviewBusy, setReviewBusy] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;

    if (propertyId.startsWith('demo')) {
      const demo = getDemoListingById(propertyId);
      if (!cancelled) {
        setDemoListing(demo || null);
        setDemoMissing(!demo);
        setApiProperty(null);
      }
      return () => {
        cancelled = true;
      };
    }

    setDemoListing(null);
    setDemoMissing(false);
    PROPERTY_SERVICE.getPropertyById(propertyId)
      .then((res: { data?: PropertyFormData }) => {
        if (!cancelled && res?.data) setApiProperty(res.data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const loadReviews = () => {
    if (!propertyId) return;
    ADMIN_SERVICE.listPublicContent('listing-review', 40)
      .then((res: { data?: Array<{ _id?: string; id?: string; data?: Record<string, string>; createdAt?: string }> }) => {
        const rows = (res.data || [])
          .map((row) => {
            const d = row.data || {};
            if (String(d.propertyId || '') !== propertyId) return null;
            return {
              id: String(row.id || row._id || Math.random()),
              name: String(d.name || 'Anonymous'),
              rating: Math.min(5, Math.max(1, Number(d.rating) || 5)),
              body: String(d.body || ''),
              createdAt: row.createdAt,
            } as PublicReview;
          })
          .filter(Boolean) as PublicReview[];
        setReviews(rows);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  useEffect(() => {
    const ownerId =
      (apiProperty as PropertyFormData & { user?: string | { _id?: string; id?: string } })?.user;
    const id = typeof ownerId === 'string' ? ownerId : ownerId?._id || ownerId?.id;
    if (!id) return;
    let cancelled = false;
    API(`${getApiBaseUrl()}/subscription/badge/${id}`, { method: 'GET' })
      .then((res: { data?: { badgeLabel?: string; badgeColor?: string } }) => {
        if (!cancelled && res?.data) setBadge(res.data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [apiProperty]);

  const media = useMemo(() => {
    if (demoListing) return [demoListing.img, ...FALLBACK_MEDIA.filter((u) => u !== demoListing.img)].slice(0, 6);
    const fromApi = apiProperty?.media?.map((m) => m.url).filter(Boolean) ?? [];
    if (fromApi.length > 0) return fromApi;
    return FALLBACK_MEDIA.map((_, i) => galleryAt(i));
  }, [apiProperty, demoListing]);

  const title = demoListing?.title || apiProperty?.title || 'Property listing';
  const location =
    demoListing?.location || apiProperty?.location || apiProperty?.address || 'Nigeria';
  const price = demoListing
    ? demoListing.price
    : apiProperty?.price
      ? Number(apiProperty.price)
      : 0;
  const beds = demoListing?.bedroom || apiProperty?.bedroom || '—';
  const baths =
    demoListing?.baths ||
    (apiProperty as PropertyFormData & { bathroom?: string })?.bathroom ||
    '—';
  const parking = apiProperty?.garagesOrParkingSpaces || (demoListing ? '2' : '—');
  const type = demoListing?.propertyType || apiProperty?.propertyType || 'Property';
  const purpose = demoListing?.purpose || apiProperty?.listingPurpose || 'sale';
  const landArea = demoListing?.areaSize
    || (apiProperty?.landArea
      ? `${apiProperty.landArea} ${apiProperty.landAreaMeasurement || 'sqm'}`.trim()
      : '');
  const agentName = demoListing?.agent || 'PropertyArena Agent';
  const agentInitials = agentName
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const description =
    apiProperty?.description ||
    (demoListing
      ? `${demoListing.title} in ${demoListing.location}. Listed by ${demoListing.agent} on PropertyArena — enquire for viewing, documents and exact pin. Always verify title and identity before any payment.`
      : 'Listing details will appear here once published.');
  const features = apiProperty?.features?.length
    ? apiProperty.features
    : demoListing
      ? [
          demoListing.purpose === 'shortlet' ? 'Furnished for short stays' : 'Ready for viewing',
          'Photos from listing agent',
          'Enquire for documents',
          'Neighbourhood guide available',
          'WhatsApp & call contact',
          'PropertyArena safety tips apply',
        ]
      : [
          'En-suite bedrooms',
          'Fitted kitchen',
          'Balcony',
          '24/7 security',
          'Parking',
        ];

  const land = isLandType(String(type), String(purpose));
  const purposeLabel =
    purpose === 'rent' ? 'for rent' : purpose === 'shortlet' ? 'short let' : 'for sale';
  const categoryLabel = `${type} ${purposeLabel}`;
  const typePlural = (() => {
    const t = String(type);
    if (/flat|apartment/i.test(t)) return 'Flats / Apartments';
    if (/land|plot/i.test(t)) return 'Land';
    if (/commercial|office|shop/i.test(t)) return 'Commercial properties';
    return `${t}s`;
  })();
  const areaName = demoListing?.area || location.split(',')[0]?.trim() || '';
  const stateName = demoListing?.state || location.split(',').map((s) => s.trim()).filter(Boolean).slice(-1)[0] || 'Lagos';
  const cityHint = areaName || stateName;
  const stateHint = stateName;
  const neighbourhoodHref = areaName
    ? `/neighbourhood/${labelToSlug(stateName)}/${labelToSlug(areaName)}`
    : `/neighbourhood/${labelToSlug(stateName)}`;
  const refId = (propertyId || 'PA-LISTING').slice(0, 16).toUpperCase();

  useEffect(() => {
    if (!form.message) {
      setForm((f) => ({
        ...f,
        message: `Hello, I would like to check availability for ${title}, ${location}. Please contact me. Thanks.`,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, location]);

  const handleContact = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await ADMIN_SERVICE.submitPublic('lead', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        property: title,
        propertyId: propertyId || '',
        source: 'Property detail',
        status: 'New',
        notes: form.message,
      });
      toast.success('Enquiry sent. The listing agent will reach out shortly.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send enquiry');
    }
  };

  const handleReport = async (e: FormEvent) => {
    e.preventDefault();
    setReportBusy(true);
    try {
      await ADMIN_SERVICE.submitPublic('listing-report', {
        propertyId: propertyId || '',
        propertyTitle: title,
        location,
        reason: reportForm.reason,
        email: reportForm.email,
        body: reportForm.details || reportForm.reason,
        status: 'New',
        slug: `report-${propertyId || 'x'}-${Date.now()}`,
      });
      toast.success('Report submitted. Our team will review this listing.');
      setReportOpen(false);
      setReportForm({ reason: REPORT_REASONS[0], email: '', details: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit report');
    } finally {
      setReportBusy(false);
    }
  };

  const handleReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewForm.body.trim()) {
      toast.error('Please write a short review');
      return;
    }
    setReviewBusy(true);
    try {
      await ADMIN_SERVICE.submitPublic('listing-review', {
        propertyId: propertyId || '',
        propertyTitle: title,
        name: reviewForm.name || 'Anonymous',
        rating: String(reviewForm.rating),
        body: reviewForm.body.trim(),
        status: 'Published',
        slug: `review-${propertyId || 'x'}-${Date.now()}`,
      });
      toast.success('Thanks — your review is live.');
      setReviewForm({ name: '', rating: 5, body: '' });
      loadReviews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit review');
    } finally {
      setReviewBusy(false);
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const prevPhoto = () => setMainIdx((i) => (i - 1 + media.length) % media.length);
  const nextPhoto = () => setMainIdx((i) => (i + 1) % media.length);

  const thumbs = media.slice(0, 4);
  const shortDesc = description.length > 280 ? `${description.slice(0, 280)}…` : description;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  if (demoMissing) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <MarketplaceHeader />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-ink">Listing not found</h1>
          <p className="mt-2 text-sm text-ink-muted">
            This demo listing ID is no longer in the catalogue.
          </p>
          <Link to="/properties" className="mt-6 inline-block font-semibold text-brand-green hover:underline">
            ← Browse properties
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <SeoHead
        title={`${categoryLabel}: ${title} — ${location}`}
        description={description.slice(0, 160)}
        path={`/properties/${propertyId || ''}`}
        image={media[0]}
      />
      <MarketplaceHeader />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            to={buildSeoPath(
              purpose === 'rent' ? 'for-rent' : purpose === 'shortlet' ? 'shortlet' : 'for-sale',
              stateHint,
              cityHint,
            )}
            className="rounded-full bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink-secondary ring-1 ring-line hover:text-brand-green"
          >
            {typePlural} {purposeLabel} in {cityHint}, {stateHint}
          </Link>
          <Link
            to={buildSeoPath(purpose === 'rent' ? 'for-rent' : 'for-sale', stateHint)}
            className="rounded-full bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink-secondary ring-1 ring-line hover:text-brand-green"
          >
            {typePlural} {purposeLabel} in {stateHint}
          </Link>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            {/* Title card — price + CTAs above gallery (NPC pattern) */}
            <article className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {(apiProperty as PropertyFormData & { isFeatured?: boolean })?.isFeatured || !apiProperty ? (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                        Premium
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-green/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green">
                      <FaCheckCircle /> Verified agent
                    </span>
                    {badge.badgeLabel && (
                      <SubscriberBadge label={badge.badgeLabel} color={badge.badgeColor || undefined} />
                    )}
                  </div>
                  <p className="text-sm font-semibold capitalize text-brand-red">{categoryLabel}</p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                    <FaMapMarkerAlt className="mt-0.5 shrink-0 text-brand-red" />
                    {location}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">
                    Ref: {refId} · Updated recently · {media.length} photos
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-extrabold text-ink sm:text-4xl">
                    {price > 0 ? `₦${price.toLocaleString()}` : 'Price on request'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhone((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
                >
                  <FaPhoneAlt className="text-xs" />
                  {showPhone ? '0800 123 4567' : 'Call agent'}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${title} (${refId}) on PropertyArena`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#128C7E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0e7a6e]"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
                <div className="ml-auto flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSaved((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${
                      saved
                        ? 'border-brand-red/40 bg-brand-red/5 text-brand-red'
                        : 'border-line text-ink-secondary hover:bg-chip'
                    }`}
                  >
                    <FaHeart /> {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-chip"
                  >
                    <FaShareAlt /> Share
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-chip"
                  >
                    <FaFlag /> Report
                  </button>
                </div>
              </div>
            </article>

            {/* Gallery */}
            <div className="overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-line">
              <div className="grid gap-1 p-1 md:grid-cols-[1fr_180px]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-chip sm:aspect-[16/9]">
                  <img
                    src={media[mainIdx]}
                    alt={title}
                    className="h-full w-full cursor-zoom-in object-cover"
                    onClick={() => setLightbox(true)}
                  />
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    aria-label="Previous photo"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    aria-label="Next photo"
                  >
                    <FaChevronRight />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                    {mainIdx + 1} / {media.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightbox(true)}
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-ink"
                  >
                    View all photos
                  </button>
                </div>
                <div className="hidden grid-rows-3 gap-1 md:grid">
                  {thumbs.slice(1, 4).map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setMainIdx(i + 1)}
                      className={`relative overflow-hidden rounded-xl ${
                        mainIdx === i + 1 ? 'ring-2 ring-brand-green' : ''
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Specs strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(land
                ? [
                    { icon: FaExpand, label: 'Size', value: landArea || 'Plot' },
                    { icon: FaMapMarkerAlt, label: 'Title', value: 'Consent / C of O' },
                    { icon: FaCheckCircle, label: 'Type', value: type },
                    { icon: FaCar, label: 'Access', value: 'Road ready' },
                  ]
                : [
                    { icon: FaBed, label: 'Beds', value: beds },
                    { icon: FaBath, label: 'Baths', value: baths },
                    { icon: FaCar, label: 'Parking', value: parking },
                    { icon: FaExpand, label: 'Type', value: type },
                  ]
              ).map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-surface-elevated px-4 py-3 shadow-sm ring-1 ring-line"
                >
                  <Icon className="mb-1 text-brand-green" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{label}</p>
                  <p className="text-sm font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <section className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <h2 className="text-lg font-extrabold text-ink">About this property</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                {descOpen ? description : shortDesc}
              </p>
              {description.length > 280 && (
                <button
                  type="button"
                  onClick={() => setDescOpen((v) => !v)}
                  className="mt-2 text-sm font-semibold text-brand-green hover:underline"
                >
                  {descOpen ? 'Show less' : 'Show full description'}
                </button>
              )}
            </section>

            {/* Features */}
            <section className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <h2 className="text-lg font-extrabold text-ink">Features and amenities</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 rounded-xl bg-chip px-3 py-2.5 text-sm text-ink-secondary"
                  >
                    <FaCheckCircle className="shrink-0 text-brand-green" /> {f}
                  </li>
                ))}
              </ul>
            </section>

            {/* Map / location */}
            <section className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <h2 className="text-lg font-extrabold text-ink">Property details</h2>
              <div className="mt-4 overflow-hidden rounded-xl">
                <div className="flex h-52 flex-col items-center justify-center bg-gradient-to-br from-[#dce8df] to-[#c5d8f0] text-center dark:from-[#1a2a1f] dark:to-[#152030]">
                  <FaMapMarkerAlt className="mb-2 text-2xl text-brand-red" />
                  <p className="text-sm font-semibold text-ink">{location}</p>
                  <p className="mt-1 max-w-sm px-4 text-xs text-ink-muted">
                    Exact pin shared after you enquire — keeps owners safe while you get area context.
                  </p>
                  <Link
                    to={neighbourhoodHref}
                    className="mt-3 text-sm font-semibold text-brand-green hover:underline"
                  >
                    Area guide for {cityHint} →
                  </Link>
                </div>
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-2 rounded-lg bg-chip px-3 py-2">
                  <dt className="text-ink-muted">Listing ID</dt>
                  <dd className="font-semibold text-ink">{refId}</dd>
                </div>
                <div className="flex justify-between gap-2 rounded-lg bg-chip px-3 py-2">
                  <dt className="text-ink-muted">Status</dt>
                  <dd className="font-semibold text-ink">{apiProperty?.status || 'Available'}</dd>
                </div>
              </dl>
            </section>

            {/* Reviews */}
            <section className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-ink">Reviews</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {reviews.length
                      ? `${avgRating.toFixed(1)} average · ${reviews.length} review${reviews.length === 1 ? '' : 's'}`
                      : 'Be the first to review this listing'}
                  </p>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar key={i} className={i <= Math.round(avgRating) ? '' : 'opacity-25'} />
                    ))}
                  </div>
                )}
              </div>

              {reviews.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {reviews.slice(0, 8).map((r) => (
                    <li key={r.id} className="rounded-xl bg-chip px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-ink">{r.name}</p>
                        <span className="flex items-center gap-0.5 text-xs text-amber-500">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FaStar key={i} className={i <= r.rating ? '' : 'opacity-25'} />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleReview} className="mt-5 space-y-3 border-t border-line pt-5">
                <p className="text-sm font-semibold text-ink">Leave a review</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ink-muted">Rating</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                      className={`text-lg ${n <= reviewForm.rating ? 'text-amber-500' : 'text-ink-muted/40'}`}
                      aria-label={`${n} stars`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                <input
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Your name (optional)"
                  className="w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                />
                <textarea
                  required
                  rows={3}
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                  placeholder="How was viewing, communication or the listing accuracy?"
                  className="w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                />
                <button
                  type="submit"
                  disabled={reviewBusy}
                  className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
                >
                  {reviewBusy ? 'Submitting…' : 'Submit review'}
                </button>
              </form>
            </section>

            {/* Safety tips — on the property, not a sidebar */}
            <SafetyTips />

            <AdSlot placement="listing_inline" />

            <p className="rounded-xl bg-chip px-4 py-3 text-xs leading-relaxed text-ink-muted">
              Disclaimer: This page is a property advertisement. PropertyArena does not guarantee accuracy of
              third-party listings — always verify title, identity and payments independently.
            </p>
          </div>

          {/* Sidebar — agent + enquiry only (clean like PP/NPC) */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Marketed by</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                  {agentInitials}
                </div>
                <div>
                  <p className="font-bold text-ink">{agentName}</p>
                  {badge.badgeLabel ? (
                    <SubscriberBadge
                      label={badge.badgeLabel}
                      color={badge.badgeColor || undefined}
                      className="mt-1"
                    />
                  ) : (
                    <p className="flex items-center gap-1 text-xs font-semibold text-brand-green">
                      <FaCheckCircle /> Verified agent
                    </p>
                  )}
                </div>
              </div>
              <Link
                to="/agents/demo-agent"
                className="mt-3 block text-xs font-semibold text-brand-green hover:underline"
              >
                View all properties from this agent →
              </Link>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPhone((v) => !v)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-green py-2.5 text-sm font-bold text-brand-green hover:bg-brand-green/5"
                >
                  <FaPhoneAlt className="text-xs" />
                  {showPhone ? '0800 123 4567' : '0700 *** Show'}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${title} on PropertyArena`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>

            <form
              onSubmit={handleContact}
              className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line"
            >
              <h3 className="font-bold text-ink">Request information</h3>
              <p className="mt-1 text-xs text-ink-muted">We route this privately to the listing agent.</p>
              <div className="mt-3 space-y-2.5">
                {(['name', 'phone', 'email'] as const).map((key) => (
                  <input
                    key={key}
                    required={key !== 'phone'}
                    type={key === 'email' ? 'email' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={
                      key === 'name' ? 'Name' : key === 'email' ? 'Email' : 'Phone number'
                    }
                    className="w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                  />
                ))}
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
                >
                  Send enquiry
                </button>
              </div>
            </form>

            <AdSlot placement="listing_sidebar" />

            <div className="rounded-2xl bg-surface-elevated p-4 text-sm shadow-sm ring-1 ring-line">
              <p className="font-bold text-ink">Useful links</p>
              <ul className="mt-2 space-y-1.5 text-brand-green">
                <li>
                  <Link
                    to={buildSeoPath('for-sale', stateHint, cityHint)}
                    className="hover:underline"
                  >
                    More in {cityHint}
                  </Link>
                </li>
                <li>
                  <Link to="/request-property" className="hover:underline">
                    Request a similar property
                  </Link>
                </li>
                <li>
                  <Link to="/subscription" className="hover:underline">
                    Advertise your property
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-elevated/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-lg font-extrabold text-ink">
              {price > 0 ? `₦${price.toLocaleString()}` : 'On request'}
            </p>
            <p className="line-clamp-1 text-xs text-ink-muted">{location}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi, interested in ${title}`)}`}
              className="rounded-xl bg-[#25D366] px-3 py-2.5 text-white"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <button
              type="button"
              onClick={() => setShowPhone(true)}
              className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white"
            >
              Call
            </button>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <img
            src={media[mainIdx]}
            alt={title}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-sm text-white"
            onClick={() => setLightbox(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* Report listing modal */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="report-title"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close report"
            onClick={() => setReportOpen(false)}
          />
          <form
            onSubmit={handleReport}
            className="relative z-10 w-full max-w-md rounded-2xl bg-surface-elevated p-5 shadow-xl ring-1 ring-line sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="report-title" className="text-lg font-extrabold text-ink">
                  Report this listing
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  We review flags for scams, wrong details and unsafe behaviour.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-chip"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <label className="block text-sm font-semibold text-ink">
              Reason
              <select
                value={reportForm.reason}
                onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-sm font-semibold text-ink">
              Your email (optional)
              <input
                type="email"
                value={reportForm.email}
                onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm"
                placeholder="so we can follow up"
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-ink">
              Details
              <textarea
                rows={4}
                value={reportForm.details}
                onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-field-border bg-field px-3 py-2.5 text-sm"
                placeholder="What looked wrong? Include WhatsApp numbers or pressure tactics if relevant."
              />
            </label>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportBusy}
                className="flex-1 rounded-xl bg-brand-red py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {reportBusy ? 'Sending…' : 'Submit report'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="h-20 lg:hidden" />
      <SiteFooter />
    </div>
  );
};

export default PropertyDetailPage;
