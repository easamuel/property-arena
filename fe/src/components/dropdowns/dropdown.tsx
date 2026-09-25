import React, { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
};

/**
 * Reusable dropdown built with Headless UI Listbox.
 * - active (hover / keyboard highlight) and selected states are fully stylable.
 * - Active and selected styles use primary-red (change as needed).
 */
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  name,
  disabled = false,
}) => {
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="text-lg font-bold text-white mb-1">{label}</label>}

      <Listbox value={value} onChange={onChange} disabled={disabled} name={name}>
        <div className="relative">
          <Listbox.Button
            className={`w-full shadow-sm p-2 rounded-md border border-gray-300 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-red bg-white text-black`}
          >
            <span className={`${selected ? '' : 'text-gray-500'}`}>{selected?.label ?? placeholder}</span>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden />
          </Listbox.Button>

          <Listbox.Options className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto focus:outline-none">
            {options.map((opt) => (
              <Listbox.Option key={opt.value} value={opt.value} as={Fragment}>
                {({ active, selected: isSelected }) => (
                  <li
                    className={`cursor-pointer px-4 py-2 text-sm list-none flex items-center justify-between
                      ${isSelected ? 'bg-primary-red text-white font-semibold' : ''}
                      ${!isSelected && active ? 'bg-primary-red/10 text-primary-red' : ''}
                    `}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span className="text-white/90 text-xs font-semibold">✓</span>}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
