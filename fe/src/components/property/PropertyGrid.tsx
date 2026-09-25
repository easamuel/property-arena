/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/property/PropertyGrid.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PropertyData } from '@/types/property';

interface PropertyGridProps {
  properties: PropertyData[];
  meta: Record<string, any>;
  setPage: (newPage: number) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, meta, setPage }) => {
  return (
    <div>
      {/* Property Listing */}
      {properties?.length === 0 ? (
        <div className="flex justify-center items-center h-full mt-24 text-gray-600">
          No properties found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties?.map((prop, idx) => (
            <div key={prop.propertyId ?? idx} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Link to={`/properties/${prop.id}`}>
                <div className="cursor-pointer">
                  {prop.media?.[0]?.url && (
                    <img
                      src={prop.media[0].url}
                      alt={prop.title}
                      className="w-full h-52 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="text-red-600 font-bold text-lg">
                      ₦{prop.price.toLocaleString()}
                    </div>
                    {prop.priceFrequency && (
                      <div className="text-sm text-gray-500 mb-2">
                        {prop.priceFrequency}
                      </div>
                    )}
                    <div className="text-xl font-bold text-black mb-2">
                      {prop.title}
                    </div>
                    <p className="text-gray-700 mb-3">{prop.description}</p>
                    {prop.location && (
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        {prop.location}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setPage(meta.page - 1)}
            disabled={!meta.hasPrevPage}
            className="px-4 py-2 border rounded bg-primary-red text-white disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-700">
            Page <strong>{meta.page}</strong> of <strong>{meta.pageCount}</strong>
          </span>

          <button
            onClick={() => setPage(meta.page + 1)}
            disabled={!meta.hasNextPage}
            className="px-4 py-2 border rounded bg-primary-red text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
