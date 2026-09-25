import React, { useState, KeyboardEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PropertyFeaturesStepProps {
  features: string[];
  onChange: (features: string[]) => void;
}

const ALL_FEATURE_OPTIONS = [
  '2 Stories',
  '24hours Security',
  "26’ Ceilings",
  'Bike Path',
  'Central Cooling',
  'Central Heating',
  'Dual Sinks',
  'Electric Range',
  'Emergency Exit',
  'Empty Land',
  'Fire Alarm',
  'Fire Place',
  'Fitted Kitchen',
  'Good for commercial purpose',
  'Good for commercial and residential purposes',
  'Good for residential purposes',
  'Good Road',
  'Home Theater',
  'Hurricane Shutters',
  'Interlocked Floor',
  'Jog Path',
  'Kitchen Cabinet',
  'Laundry Room',
  'Lawn',
  'Marble Floors',
  'Modern and affordable',
  'Next to busy way',
  'Parking Space',
  'Pop Ceiling',
  'Gated Environment',
  'Serene Environment',
  'Spacious living rooms'
];

const PropertyFeaturesStep: React.FC<PropertyFeaturesStepProps> = ({ features, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addFeature = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !features.includes(trimmed)) {
      onChange([...features, trimmed]);
      setInputValue('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    onChange(features.filter(f => f !== featureToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const toggleFeature = (option: string) => {
    if (features.includes(option)) {
      onChange(features.filter(f => f !== option));
    } else {
      onChange([...features, option]);
    }
  };

  return (
    <div className="space-y-4 p-[5%]">
      <h2 className="text-lg font-medium mb-2">Property Features</h2>

      {/* selected tags */}
      <div className="flex gap-2 flex-wrap mb-2">
        {features.map((feature, idx) => (
          <span
            key={feature + idx}
            className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm"
          >
            {feature}
            <button
              type="button"
              onClick={() => removeFeature(feature)}
              className="ml-2 focus:outline-none"
              aria-label={`Remove ${feature}`}
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>

      {/* input to add custom feature */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a feature and hit Enter"
          className="flex-1 p-2 border rounded-md shadow-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={addFeature}
          className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-secondary-red disabled:opacity-50"
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Press Enter or click "Add" to save a feature.
      </div>

      {/* checkbox grid */}
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_FEATURE_OPTIONS.map((option) => {
            const checked = features.includes(option);
            return (
              <label
                key={option}
                className="flex items-center gap-2 p-2 border rounded-md cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(option)}
                  className="w-4 h-4"
                  aria-checked={checked}
                  aria-label={option}
                />
                <span className="text-sm">{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyFeaturesStep;
