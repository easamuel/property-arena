import React, { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface MeasurementInputProps {
  value: number | string;
  measurement: string;
  measurementOptions: string[];
  onValueChange: (value: number | string) => void;
  onMeasurementChange: (unit: string) => void;
  placeholder?: string;
  className?: string;
}

const MeasurementInputWithDropdown: React.FC<MeasurementInputProps> = ({
  value,
  measurement,
  measurementOptions,
  onValueChange,
  onMeasurementChange,
  placeholder = '',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <input
        type="text"
        className="w-full shadow-md p-3 pr-20 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-red"
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={placeholder}
      />

      {/* Dropdown button inside input field */}
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="h-[80%] pl-2 pr-2 py-1 text-xs font-semibold bg-primary-red text-white rounded border border-primary-red flex items-center gap-1"
        >
          {measurement.toUpperCase()}
          <ChevronUpDownIcon className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-md z-50 w-32">
            {measurementOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onMeasurementChange(option);
                  setIsOpen(false);
                }}
                className={` cursor-pointer w-full px-4 py-2 text-sm text-left hover:bg-red-50 ${measurement === option ? 'bg-primary-red font-bold' : ''
                  }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementInputWithDropdown;
