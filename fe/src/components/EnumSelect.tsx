import React from 'react';
import Dropdown, { DropdownOption } from './dropdowns/dropdown';

type EnumSelectProps = {
  label: string;
  enumObject: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
};

export const EnumSelect: React.FC<EnumSelectProps> = ({
  label,
  enumObject,
  value,
  onChange,
  placeholder = 'Select an option',
  name,
  className = '',
}) => {
  const options: DropdownOption[] = Object.entries(enumObject).map(([key, val]) => ({
    label: val,
    value: val,
  }));

  return (
    <div className={`w-full md:w-auto ${className}`}>
      <Dropdown
        label={label}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};

export default EnumSelect;
