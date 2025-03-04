'use client';

import React, { useState, useRef, useEffect } from 'react';
import Filters from '@/app/admin/Filters';
import { SelectFilterItemProps } from '@/app/admin/SelectFilterItem';

export interface FiltersState {
  tags: string[];
  all: string;
  sortBy: string;
  sortOrder: string;
}

interface UserFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle checkbox selection
  const handleTagsChange = (checked: boolean, optionValue: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, optionValue] // Add tag
        : prev.tags.filter((val) => val !== optionValue), // Remove tag
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tags`;
        const response = await fetch(url);
        const result = await response.json();
        setTags(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchTags();
  }, []);

  // Other filter items
  const items: SelectFilterItemProps[] = [
    {
      label: 'All/Any:',
      value: filters.all,
      onChange: () => setFilters((prev) => ({ ...prev, all: prev.all == 'all' ? 'any' : 'all'})),
      options: [
        { value: 'all', label: 'All' },
        { value: 'any', label: 'Any' },
      ],
    },
    {
      label: 'Sort By:',
      value: filters.sortBy,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, sortBy: newValue })),
      options: [
        { value: 'level', label: 'Level' },
        { value: 'accuracy', label: 'Accuracy' },
        { value: 'engagement', label: 'Engagement' },
        { value: 'games_started', label: 'Games Started' },
        { value: 'score', label: 'Score' },
      ],
    },
    {
      label: 'Sort Order:',
      value: filters.sortOrder,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, sortOrder: newValue })),
      options: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
      ],
    },
  ];

  return (
    <Filters items={items} prependChildren={
      /* Custom Multi-Select Dropdown for Tags */
      <div className='relative flex flex-col gap-4 w-full md:w-1/3' ref={dropdownRef}>
        <label className='font-bold text-lg'>{'Tags:'}</label>
        <button
          type='button'
          onClick={toggleDropdown}
          className='px-6 py-3 bg-blue-500 text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-left'
        >
          {filters.tags.length > 0 ? filters.tags.join(', ') : 'Select Tags'}
        </button>

        {isOpen && (
          <div className='absolute top-full left-0 mt-2 w-full bg-blue-500 border border-blue-500 rounded-lg shadow-lg z-10'>
            <div className='max-h-48 overflow-y-auto'>
              {tags.map((tag) => (
                <label
                  key={tag}
                  className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-600 text-white'
                >
                  <input
                    type='checkbox'
                    checked={filters.tags.includes(tag)}
                    onChange={(e) => handleTagsChange(e.target.checked, tag)}
                    className='cursor-pointer'
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    } />
  );
};

export default UserFilters;