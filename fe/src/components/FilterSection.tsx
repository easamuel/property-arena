// src/components/FilterSection.tsx
import React from 'react';

interface FilterSectionProps {
  label: string;
  enumData?: { [key: string]: string };
  selectedValues: string[];
  onChange: (value: string) => void;
  isPriceFilter?: boolean;
  minPrice?: string;
  maxPrice?: string;
  onPriceChange?: (minPrice: string, maxPrice: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  label,
  enumData,
  selectedValues,
  onChange,
  isPriceFilter = false,
  minPrice,
  maxPrice,
  onPriceChange,
}) => {
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (onPriceChange) {
      if (name === 'minPrice') {
        onPriceChange(value, maxPrice || '');
      } else if (name === 'maxPrice') {
        onPriceChange(minPrice || '', value);
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">{label}</h2>

      {isPriceFilter ? (
        <>
          {/* Price Range Inputs */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="minPrice" className="text-sm text-gray-700">Min Price</label>
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={handlePriceInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Min Price"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="maxPrice" className="text-sm text-gray-700">Max Price</label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={handlePriceInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Max Price"
                />
              </div>
            </div>
          </div>

          {/* Predefined Price Ranges */}
          <div className="space-y-3">
            {[
              { label: 'Under 1 Million', value: '0-1000000' },
              { label: '1 to 10 Million', value: '1000000-10000000' },
              { label: '10 to 20 Million', value: '10000000-20000000' },
              { label: '20 to 50 Million', value: '20000000-50000000' },
              { label: '50 to 100 Million', value: '50000000-100000000' },
              { label: '100 to 200 Million', value: '100000000-200000000' },
              { label: '200 to 500 Million', value: '200000000-500000000' },
              { label: '500 Million and Above', value: '500000000-' },
            ].map(({ label, value }) => (
              <label key={value} className="custom-checkbox-label flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => onChange(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </>
      ) : (
        // Regular Filter (like property types, bedrooms)
        <div className="space-y-3">
          {Object.entries(enumData || {}).map(([key, label]) => (
            <label key={key} className="custom-checkbox-label flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedValues.includes(label)}
                onChange={() => onChange(label)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
