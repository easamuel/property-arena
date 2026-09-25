import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { guideMapBySlug } from '@/data/guide';

const SubLocationDetails: React.FC = () => {
  const { slug, subSlug } = useParams<{ slug: string; subSlug: string }>();
  if (!slug || !subSlug) return <div className="p-6">Loading...</div>;

  const item = guideMapBySlug[slug];
  const sub = item?.subLocations?.find(s => s.slug === subSlug);

  if (!item || !sub) {
    return <div className="p-6">Not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 bg-white border rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <Link to={`/neighbourhood/${slug}`} className="text-sm text-blue-600 underline">Back to {item.location}</Link>
        <h1 className="text-2xl font-bold mt-4">{sub.name}</h1>
        <img src={sub.image} alt={sub.name} className="w-full h-64 object-cover rounded mt-4" />
        <p className="mt-4 text-gray-700">{sub.description ?? 'No description yet.'}</p>
      </div>
    </div>
  );
};

export default SubLocationDetails;
