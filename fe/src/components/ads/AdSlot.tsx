import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_SERVICE } from '@/services/admin';
import type { AdPlacement } from '@/lib/ad-placements';

type Promo = {
  _id?: string;
  id?: string;
  data?: {
    campaign?: string;
    title?: string;
    placement?: string;
    imageUrl?: string;
    href?: string;
    ctaUrl?: string;
    status?: string;
    body?: string;
  };
};

type Props = {
  placement: AdPlacement;
  className?: string;
};

export function AdSlot({ placement, className = '' }: Props) {
  const [items, setItems] = useState<Promo[]>([]);

  useEffect(() => {
    let cancelled = false;
    ADMIN_SERVICE.listPublicContent('promotion')
      .then((res: { data?: Promo[] }) => {
        if (cancelled) return;
        const rows = (res.data || []).filter((p) => {
          const d = p.data || {};
          const status = String(d.status || '').toLowerCase();
          const place = String(d.placement || '').toLowerCase();
          const active = !status || status === 'active' || status === 'published';
          return active && place === placement;
        });
        setItems(rows.slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (!items.length) return null;

  return (
    <aside className={`space-y-3 ${className}`} data-ad-placement={placement}>
      {items.map((item) => {
        const d = item.data || {};
        const title = d.title || d.campaign || 'Featured';
        const href = d.ctaUrl || d.href || '/subscription';
        const key = item.id || item._id || title;
        const inner = (
          <>
            {d.imageUrl && (
              <img src={d.imageUrl} alt="" className="h-28 w-full object-cover" loading="lazy" />
            )}
            <div className="p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-green">Sponsored</p>
              <p className="mt-1 text-sm font-bold text-ink">{title}</p>
              {d.body && <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{d.body}</p>}
            </div>
          </>
        );
        const cls =
          'block overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-sm transition hover:shadow-md';
        if (href.startsWith('http')) {
          return (
            <a key={key} href={href} target="_blank" rel="noreferrer" className={cls}>
              {inner}
            </a>
          );
        }
        return (
          <Link key={key} to={href} className={cls}>
            {inner}
          </Link>
        );
      })}
    </aside>
  );
}

export default AdSlot;
export type { AdPlacement };
