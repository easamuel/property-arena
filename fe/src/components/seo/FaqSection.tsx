import { useId, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export type FaqItem = { q: string; a: string };

type Props = {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
};

/** Accordion FAQs with FAQPage JSON-LD for rich results. */
export default function FaqSection({
  title = 'Frequently asked questions',
  subtitle,
  items,
  className = '',
}: Props) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  if (!items.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const nested = className.includes('!py-0') || className.includes('!bg-transparent');

  return (
    <section
      className={
        nested
          ? className
          : `border-t border-line bg-surface-muted py-14 sm:py-16 ${className}`
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={nested ? '' : 'mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'}>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-ink-secondary">{subtitle}</p> : null}
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-elevated">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-chip/60"
                >
                  <span className="text-sm font-semibold text-ink sm:text-base">{item.q}</span>
                  <FaChevronDown
                    className={`mt-1 shrink-0 text-xs text-ink-muted transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="border-t border-line bg-surface px-5 py-4 text-sm leading-relaxed text-ink-secondary"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
