'use client';

import React from 'react';
import Filters from '@/app/admin/Filters';
import { SelectFilterItemProps } from '@/app/admin/SelectFilterItem';

interface FiltersState {
  tags: string;
  all: boolean;
  sortBy: string;
  sortOrder: string;
}

interface UserFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, setFilters }) => {
  // Build an array of filter definitions
  const items: SelectFilterItemProps[] = [
    {
      label: 'Tags:',
      value: filters.tags,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, tags: newValue })),
      options: [
        { value: 'Lung Legend', label: 'Lung Legend' },
        { value: 'Neuro Ninja', label: 'Neuro Ninja' },
        { value: 'X-Ray Visionary', label: 'X-Ray Visionary' },
        { value: 'AI Antagonist', label: 'AI Antagonist' },
        { value: 'Diagnosis Master', label: 'Diagnosis Master' },
        { value: 'AI Skeptic', label: 'AI Skeptic' }
      ],
    },
    {
      label: 'All/Any:',
      value: 'Any',
      onChange: (newValue) => setFilters((prev) => ({...prev, all: !filters.all})),
      options: [
        { value: 'true', label: 'All' },
        { value: 'false', label: 'Any' }
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

  return <Filters items={items} />;
};

export default UserFilters;