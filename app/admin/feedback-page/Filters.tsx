'use client';
import React from 'react';
import SelectFilterItem, { SelectFilterItemProps } from './SelectFilterItem';

interface FiltersProps {
  items: SelectFilterItemProps[];
}

/**
 * A generic container that renders a list of SelectFilterItem components,
 * each with its own label/value/options.
 */
const Filters: React.FC<FiltersProps> = ({ items }) => {
  return (
    <div className='flex flex-wrap gap-6 justify-center p-8 bg-white rounded-2xl shadow-lg mb-8'>
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
