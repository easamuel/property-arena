import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ReactNode } from 'react';

type SeoHeadProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

const SITE = 'https://propertyarena.ng';
const DEFAULT_DESC =
  "Nigeria's property marketplace — buy, rent, short let and land from verified agents.";

export function SeoHead({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image = '/logo.png',
  noIndex = false,
}: SeoHeadProps) {
  const fullTitle = title.includes('PropertyArena') ? title : `${title} | PropertyArena.ng`;
  const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image.startsWith('http') ? image : `${SITE}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export function AppHelmetProvider({ children }: { children: ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}

export default SeoHead;
