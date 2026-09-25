import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Country, State } from 'country-state-city';
import React, { useEffect, useState } from 'react';

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
}

const LocationDropdown: React.FC<LocationComboboxProps> = ({
  value,
  onChange,
  countryCode = 'NG' // for now, limit to Nigeria
}) => {
  const [states, setStates] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchedStates = State.getStatesOfCountry(countryCode);
    const countryName = Country.getCountryByCode(countryCode)?.name || '';
    const formattedStates = fetchedStates.map((state) => `${state.name}, ${countryName}`);
    setStates(formattedStates);
  }, [countryCode]);

  const filteredStates =
    query === ''
      ? states
      : states.filter((state) => state.toLowerCase().includes(query.toLowerCase()));


  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ComboboxInput
          className="w-full shadow-md p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          displayValue={(val: string) => val}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Lagos, Nigeria"
        />
        {filteredStates.length > 0 && (
          <ComboboxOptions className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredStates.map((location) => (
              <ComboboxOption
                key={location}
                value={location}
                className={({ active }) =>
                  `cursor-pointer select-none p-2 ${active ? 'bg-primary-red text-white' : 'text-gray-900'
                  }`
                }
              >
                {location}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};

export default LocationDropdown;