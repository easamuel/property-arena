import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  // label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="w-full mb-4">
      {/* <label className="block font-normal mb-1">{label}</label> */}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full shadow-md p-2 rounded-md border border-gray-300 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-red">
            <span>{selectedOption?.label ?? 'Select'}</span>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary-red rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map(({ label, value }) => (
              <Listbox.Option
                key={value}
                value={value}
                className={({ selected, active }) =>
                  `cursor-pointer px-4 py-2 text-sm ${selected ? 'bg-primary-red -hover font-semibold text-white' :
                    active ? 'bg-red-50' :
                      ''
                  }`
                }
              >
                {label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
