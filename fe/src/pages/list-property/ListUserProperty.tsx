import { PROPERTY_SERVICE } from "@/services/property";
import { PropertyData, PropertyFormData } from "@/types/property";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Meta {
  total: number;
  limit: number;
  pageCount: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

const ListUserProperty = () => {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const LIMIT = 10;
  
    useEffect(() => {
      const fetchProperties = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const res: any = await PROPERTY_SERVICE.getUserProperties(page, LIMIT);
          const list = Array.isArray(res.data) ? res.data : [];
          setProperties(list as PropertyData[]);
          setMeta(res.meta);
        } catch (err: any) {
          console.error(err);
          setError('Failed to load properties.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchProperties();
    }, [page]);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full mt-24">
          <span>Loading properties…</span>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-full mt-24 text-red-600">
          {error}
        </div>
      );
    }
  
    if (!properties.length) {
      return (
        <div className="flex justify-center items-center h-full mt-24 text-gray-600">
          No properties found.
        </div>
      );
    }
  
    return (
      <div className="flex justify-center mt-24">
        <div className="main-con-style p-8">
          <h1 className="text-2xl font-semibold mb-6">My Properties</h1>
          <div className="flex flex-wrap gap-6">
            {properties.map((prop, idx) => (
              <div
                key={prop.propertyId ?? idx}
                className="w-full sm:w-[48%] bg-white shadow-md rounded-lg overflow-hidden"
              >

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
                <div className="p-4 pt-0 flex justify-end">
                  <Link
                    to={`/properties/${prop.id}/edit`}
                    className="text-sm bg-primary-red text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
  
          {/* --- Pagination Controls --- */}
          {meta && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta.hasPrevPage}
                className="px-4 py-2 border rounded bg-primary-red text-white disabled:opacity-50"
              >
                Prev
              </button>
  
              {/* Page Indicator */}
              <span className="text-gray-700">
                Page <strong>{meta.page}</strong> of <strong>{meta.pageCount}</strong>
              </span>
  
              <button
                onClick={() => setPage((p) => Math.min(meta.pageCount, p + 1))}
                disabled={!meta.hasNextPage}
                className="px-4 py-2 border rounded bg-primary-red text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
export default ListUserProperty;
