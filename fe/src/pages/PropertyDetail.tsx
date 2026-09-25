import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaBath,
  FaBed,
  FaCar,
  FaCheckCircle,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlay,
  FaShareAlt,
  FaShieldAlt,
  FaWhatsapp,
} from 'react-icons/fa';
import MarketplaceHeader from '@/components/navbar/MarketplaceHeader';
import SiteFooter from '@/components/footer/SiteFooter';
import AdSlot from '@/components/ads/AdSlot';
import SubscriberBadge from '@/components/brand/SubscriberBadge';
import SeoHead from '@/components/seo/SeoHead';
import { ADMIN_SERVICE } from '@/services/admin';
import { PROPERTY_SERVICE } from '@/services/property';
import { getApiBaseUrl } from '@/services/api';
import { API } from '@/services/api';
import { PropertyFormData } from '@/types/property';
import { useToast } from '@/hooks/useToast';

const FALLBACK_MEDIA = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop',
];

const SECTIONS = ['Story', 'Spaces', 'On the map', 'Ask'] as const;

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const toast = useToast();
  const [apiProperty, setApiProperty] = useState<PropertyFormData | null>(null);
  const [section, setSection] = useState<(typeof SECTIONS)[number]>('Story');
  const [mainIdx, setMainIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [badge, setBadge] = useState<{ badgeLabel?: string | null; badgeColor?: string | null }>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    if (!propertyId || propertyId.startsWith('demo')) return;
    let cancelled = false;
    PROPERTY_SERVICE.getPropertyById(propertyId)
      .then((res: { data?: PropertyFormData }) => {
        if (!cancelled && res?.data) setApiProperty(res.data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
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
    const fromApi = apiProperty?.media?.map((m) => m.url).filter(Boolean) ?? [];
    return fromApi.length > 0 ? fromApi : FALLBACK_MEDIA;
  }, [apiProperty]);

  const title = apiProperty?.title || 'Featured home';
  const location = apiProperty?.location || apiProperty?.address || 'Lagos, Nigeria';
  const price = apiProperty?.price ? Number(apiProperty.price) : 0;
  const beds = apiProperty?.bedroom || '—';
  const baths = (apiProperty as PropertyFormData & { bathroom?: string })?.bathroom || '—';
  const parking = apiProperty?.garagesOrParkingSpaces || '—';
  const type = apiProperty?.propertyType || 'Home';
  const purpose = apiProperty?.listingPurpose || 'sale';
  const description =
    apiProperty?.description ||
    'A carefully finished property with strong access to schools, markets and major roads. Book a private viewing and verify title documents with a trusted agent.';
  const features = apiProperty?.features?.length
    ? apiProperty.features
    : ['Security', 'Parking', 'Fitted kitchen', 'POP ceiling', 'Water heater'];

  const cityHint = location.split(',')[0]?.trim() || 'Lagos';
  const arenaScore = Math.min(
    98,
    72 +
      (apiProperty?.media?.length ? 8 : 0) +
      (features.length > 4 ? 6 : 0) +
      (badge.badgeLabel ? 10 : 4),
  );

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
      setForm((f) => ({ ...f, message: '' }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send enquiry');
    }
  };

  const requestInspection = async () => {
    try {
      await ADMIN_SERVICE.submitPublic('booking', {
        name: form.name || 'Website visitor',
        phone: form.phone,
        email: form.email,
        property: title,
        propertyId: propertyId || '',
        date: 'To be confirmed',
        status: 'Requested',
      });
      toast.success('Inspection requested. Expect a confirmation soon.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not request inspection');
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

  return (
    <div className="min-h-screen bg-surface-muted pb-28">
      <SeoHead
        title={title}
        description={description.slice(0, 160)}
        path={`/properties/${propertyId || ''}`}
        image={media[0]}
      />
      <MarketplaceHeader />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-green">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-brand-green">Listings</Link>
          <span>/</span>
          <Link to={`/properties?location=${encodeURIComponent(cityHint)}`} className="hover:text-brand-green">
            {cityHint}
          </Link>
          <span>/</span>
          <span className="max-w-[12rem] truncate font-medium text-ink-secondary sm:max-w-none">
            {title}
          </span>
        </nav>

        {/* Gallery + sidebar share the same top row so ads sit flush with photos */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-line">
              <div className="grid gap-1.5 p-1.5 md:grid-cols-[2fr_1fr]">
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="relative min-h-[240px] overflow-hidden rounded-xl sm:min-h-[340px]"
                >
                  <img src={media[mainIdx]} alt={title} className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white">
                    <FaPlay className="text-[10px]" /> Tour-ready photos
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-900">
                    {media.length} photos
                  </span>
                </button>
                <div className="hidden grid-cols-2 gap-1.5 md:grid">
                  {media.slice(0, 4).map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setMainIdx(i)}
                      className={`relative overflow-hidden rounded-xl ${mainIdx === i ? 'ring-2 ring-brand-green' : ''}`}
                    >
                      <img src={src} alt="" className="h-[166px] w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto px-3 pb-3 md:hidden">
                {media.map((src, i) => (
                  <button key={src + i} type="button" onClick={() => setMainIdx(i)} className="shrink-0">
                    <img
                      src={src}
                      alt=""
                      className={`h-16 w-24 rounded-lg object-cover ${mainIdx === i ? 'ring-2 ring-brand-green' : ''}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-brand-green/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green">
                      For {purpose}
                    </span>
                    {(apiProperty as PropertyFormData & { isFeatured?: boolean })?.isFeatured ? (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                        Featured
                      </span>
                    ) : null}
                    {badge.badgeLabel && (
                      <SubscriberBadge label={badge.badgeLabel} color={badge.badgeColor || undefined} />
                    )}
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                    <FaMapMarkerAlt className="text-brand-red" /> {location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Asking</p>
                  <p className="text-2xl font-extrabold text-brand-green sm:text-3xl">
                    {price > 0 ? `₦${price.toLocaleString()}` : 'Price on request'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { icon: FaBed, label: 'Beds', value: beds },
                  { icon: FaBath, label: 'Baths', value: baths },
                  { icon: FaCar, label: 'Parking', value: parking },
                  { icon: FaHome, label: 'Type', value: type },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-chip px-3 py-3">
                    <Icon className="mb-1 text-brand-green" />
                    <p className="text-[11px] uppercase tracking-wide text-ink-muted">{label}</p>
                    <p className="text-sm font-bold text-ink">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                  {arenaScore}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">Arena Confidence</p>
                  <p className="text-xs text-ink-muted">
                    Based on media quality, listing completeness and seller plan — our score, not theirs.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green">
                  <FaShieldAlt /> Protected enquiry
                </span>
              </div>

              <div className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
                {SECTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSection(s)}
                    className={`shrink-0 px-3 py-2.5 text-sm font-semibold transition ${
                      section === s
                        ? 'border-b-2 border-brand-green text-brand-green'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                {section === 'Story' && (
                  <div>
                    <h2 className="text-lg font-bold text-ink">The story</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{description}</p>
                    <Link
                      to={`/neighbourhood/${cityHint.toLowerCase().replace(/\s+/g, '-')}`}
                      className="mt-4 inline-flex text-sm font-semibold text-brand-green hover:underline"
                    >
                      Explore the {cityHint} neighbourhood guide →
                    </Link>
                  </div>
                )}
                {section === 'Spaces' && (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 rounded-lg bg-chip px-3 py-2 text-sm text-ink-secondary"
                      >
                        <FaCheckCircle className="shrink-0 text-brand-green" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                {section === 'On the map' && (
                  <div className="overflow-hidden rounded-xl">
                    <div className="flex h-56 flex-col items-center justify-center bg-gradient-to-br from-[#dce8df] to-[#c5d8f0] text-center dark:from-[#1a2a1f] dark:to-[#152030]">
                      <FaMapMarkerAlt className="mb-2 text-2xl text-brand-red" />
                      <p className="text-sm font-semibold text-ink">{location}</p>
                      <p className="mt-1 max-w-sm px-4 text-xs text-ink-muted">
                        Exact pin is shared after you enquire — keeps owners safe while you still get area context.
                      </p>
                      <Link
                        to={`/properties?location=${encodeURIComponent(cityHint)}`}
                        className="mt-3 text-sm font-semibold text-brand-green hover:underline"
                      >
                        More homes in {cityHint}
                      </Link>
                    </div>
                  </div>
                )}
                {section === 'Ask' && (
                  <div className="rounded-xl border border-dashed border-line-strong p-4">
                    <p className="text-sm text-ink-secondary">
                      Looking for something close but not quite this listing?
                    </p>
                    <Link
                      to="/request-property"
                      className="mt-3 inline-flex rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-surface"
                    >
                      Post a property request
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <AdSlot placement="listing_sidebar" />

            <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Listed with</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                  PA
                </div>
                <div>
                  <p className="font-bold text-ink">PropertyArena Agent</p>
                  {badge.badgeLabel ? (
                    <SubscriberBadge label={badge.badgeLabel} color={badge.badgeColor || undefined} className="mt-1" />
                  ) : (
                    <p className="flex items-center gap-1 text-xs text-brand-green">
                      <FaCheckCircle /> Platform listed
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhone((v) => !v)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-green py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
                >
                  <FaPhoneAlt className="text-xs" />
                  {showPhone ? '0800 ••• ••••' : 'Reveal'}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${title} on PropertyArena`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-white"
                >
                  <FaWhatsapp /> Chat
                </a>
              </div>
            </div>

            <form
              onSubmit={handleContact}
              className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line"
            >
              <h3 className="font-bold text-ink">Send a private enquiry</h3>
              <p className="mt-1 text-xs text-ink-muted">We route this to the listing owner — no public comments.</p>
              <div className="mt-3 space-y-2.5">
                {(['name', 'email', 'phone'] as const).map((key) => (
                  <input
                    key={key}
                    required={key !== 'phone'}
                    type={key === 'email' ? 'email' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={key === 'name' ? 'Your name' : key === 'email' ? 'Email' : 'Phone'}
                    className="w-full rounded-lg border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                  />
                ))}
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="When can I view this property?"
                  className="w-full rounded-lg border border-field-border bg-field px-3 py-2.5 text-sm outline-none focus:border-brand-green"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand-green py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
                >
                  Send enquiry
                </button>
              </div>
            </form>

            <div className="rounded-2xl bg-surface-elevated p-5 shadow-sm ring-1 ring-line">
              <h3 className="font-bold text-ink">Quick facts</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Listing ID</dt>
                  <dd className="truncate font-medium text-ink">{propertyId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Status</dt>
                  <dd className="font-medium text-ink">{apiProperty?.status || 'Available'}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line-strong py-2 text-sm font-semibold text-ink"
                >
                  <FaShareAlt /> Share
                </button>
                <button
                  type="button"
                  onClick={requestInspection}
                  className="flex-1 rounded-lg bg-ink py-2 text-sm font-semibold text-surface"
                >
                  Book viewing
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>
      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-line dark:bg-surface-muted/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-extrabold text-brand-green">
              {price > 0 ? `₦${price.toLocaleString()}` : 'On request'}
            </p>
            <p className="hidden text-xs text-gray-500 sm:block">{location}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-200 p-2.5 text-brand-red dark:border-line-strong"
              aria-label="Save"
            >
              <FaHeart />
            </button>
            <button
              type="button"
              onClick={requestInspection}
              className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white"
            >
              Book viewing
            </button>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
        >
          <img src={media[mainIdx]} alt={title} className="max-h-full max-w-full rounded-lg object-contain" />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
            onClick={() => setLightbox(false)}
          >
            Close
          </button>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default PropertyDetailPage;
