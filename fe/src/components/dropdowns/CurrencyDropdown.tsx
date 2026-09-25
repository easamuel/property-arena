import React, { useEffect, useState } from 'react';

interface CurrencyFieldProps {
  value: number | string;
  currency: string;
  currencyOptions: string[];
  onValueChange: (value: number) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyFieldWithToggle: React.FC<CurrencyFieldProps> = ({
  value,
  currency,
  currencyOptions,
  onValueChange,
  onCurrencyChange,
  placeholder = "Enter amount",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState<string>(
    typeof value === 'number' ? formatWithCommas(value.toString()) : value.toString()
  );

  useEffect(() => {
    if (typeof value === 'number') {
      setInputValue(formatWithCommas(value.toString()));
    }
  }, [value]);

  function formatWithCommas(val: string): string {
    const num = val.replace(/,/g, '');
    if (!num) return '';
    return parseFloat(num).toLocaleString('en-NG');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(raw)) {
      setInputValue(formatWithCommas(raw));
      onValueChange(Number(raw));
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        className="w-full shadow-md p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-red"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />

      <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
        {currencyOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onCurrencyChange(option)}
            className={`cursor-pointer h-[80%] px-2 py-1 text-xs font-semibold border border-primary-red rounded ${currency === option
              ? 'bg-primary-red text-white border-primary-green'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
