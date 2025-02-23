'use client';
import React from 'react';

export interface SelectFilterItemProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const SelectFilterItem: React.FC<SelectFilterItemProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className='flex flex-col gap-4 w-full md:w-1/3'>
      <label className='font-bold text-lg'>{label}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className='px-6 py-3 bg-blue-500 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilterItem;
