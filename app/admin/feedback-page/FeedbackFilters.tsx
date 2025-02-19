'use client';

import React from 'react';
import Filters from '@/app/admin/feedback-page/Filters';
import { SelectFilterItemProps } from '@/app/admin/feedback-page/SelectFilterItem';

interface FiltersState {
  type: string;
  resolved: boolean | null;
  sortBy: string;
  sortOrder: string;
}

interface FeedbackFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({ filters, setFilters }) => {
  // Build an array of filter definitions
  const items: SelectFilterItemProps[] = [
    {
      label: 'Image Type:',
      value: filters.type,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, type: newValue })),
      options: [
        { value: 'all', label: 'All' },
        { value: 'real', label: 'Real' },
        { value: 'ai', label: 'AI' },
      ],
    },
    {
      label: 'Resolved:',
      value: filters.resolved === null ? 'all'
              : filters.resolved ? 'true' : 'false',
      onChange: (newValue) => setFilters((prev) => ({
        ...prev,
        resolved: newValue === 'all' ? null : newValue === 'true'
      })),
      options: [
        { value: 'all', label: 'All' },
        { value: 'true', label: 'Resolved' },
        { value: 'false', label: 'Unresolved' },
      ],
    },
    {
      label: 'Sort By:',
      value: filters.sortBy,
      onChange: (newValue) =>
        setFilters((prev) => ({ ...prev, sortBy: newValue })),
      options: [
        { value: 'last_feedback_time', label: 'Time of Last Feedback' },
        { value: 'unresolved_count', label: 'Amount of Unresolved Feedback' },
        { value: 'upload_time', label: 'Time of Image Upload' },
        { value: 'image_id', label: 'Image ID' },
      ],
    },
    {
      label: 'Sort Order:',
      value: filters.sortOrder,
      onChange: (newValue) =>
        setFilters((prev) => ({ ...prev, sortOrder: newValue })),
      options: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
      ],
    },
  ];

  return <Filters items={items} />;
};

export default FeedbackFilters;
