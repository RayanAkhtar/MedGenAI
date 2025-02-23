'use client';
import React from 'react';
import SelectFilterItem, { SelectFilterItemProps } from '@/app/admin/SelectFilterItem';

interface FiltersProps {
  items: SelectFilterItemProps[];
  prependChildren?: React.ReactNode;
}

/**
 * A generic container that renders a list of SelectFilterItem components,
 * each with its own label/value/options.
 */
const Filters: React.FC<FiltersProps> = ({ items, prependChildren }) => {
  return (
    <div className='flex flex-wrap gap-6 justify-center p-8 bg-white rounded-2xl shadow-lg mb-8'>
      {prependChildren}
      {items.map((itemProps, index) => (
        <SelectFilterItem 
          key={`${itemProps.label}-${index}`}
          {...itemProps}
        />
      ))}
    </div>
  );
};

export default Filters;
