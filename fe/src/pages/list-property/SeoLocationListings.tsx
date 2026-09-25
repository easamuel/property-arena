import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PropertyList from '@/pages/list-property/ListProperty';
import SeoHead from '@/components/seo/SeoHead';
import {
  SEO_KIND_TO_FILTERS,
  SeoListingKind,
  seoPageCopy,
  slugToLabel,
} from '@/lib/seo';

type Props = { kind: SeoListingKind };

const SeoLocationListings = ({ kind }: Props) => {
  const { state, area } = useParams<{ state: string; area?: string }>();

  const filters = SEO_KIND_TO_FILTERS[kind];
  const locationLabel = useMemo(() => {
    if (!state) return '';
    return area ? `${slugToLabel(area)}, ${slugToLabel(state)}` : slugToLabel(state);
  }, [state, area]);

  const copy = useMemo(
    () => (state ? seoPageCopy(kind, state, area) : null),
    [kind, state, area],
  );

  const path = state
    ? area
      ? `/${kind}/in/${state}/${area}`
      : `/${kind}/in/${state}`
    : '/properties';

  const seoFilters = useMemo(
    () =>
      state
        ? {
            purpose: filters.purpose,
            propertyType: filters.propertyType,
            location: locationLabel,
          }
        : undefined,
    [state, filters.purpose, filters.propertyType, locationLabel],
  );

  if (!state || !copy || !seoFilters) {
    return <Navigate to="/properties" replace />;
  }

  return (
    <>
      <SeoHead title={copy.title} description={copy.description} path={path} />
      <PropertyList
        seoFilters={seoFilters}
        seoHeading={`Property ${filters.label} in ${copy.place}`}
        seoCanonicalPath={path}
      />
    </>
  );
};

export default SeoLocationListings;
