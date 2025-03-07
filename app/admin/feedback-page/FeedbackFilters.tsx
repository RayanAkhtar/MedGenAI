'use client';

import React from 'react';
import Filters from '@/app/admin/Filters';
import { SelectFilterItemProps } from '@/app/admin/SelectFilterItem';

interface FiltersState {
  type: string;
  resolved: boolean | null;
  sortBy: string;
  sortOrder: string;
  sex: string;
  disease: string;
  ageRange: string;
}

interface FeedbackFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({ filters, setFilters }) => {
  // Define the options for the new filters
  const sexOptions = [
    { value: '', label: 'No Filter' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  const diseaseOptions = [
    { value: '', label: 'No Filter' },
    { value: 'none', label: 'None' },
    { value: 'Pleural_Effusion', label: 'Pleural Effusion' },
  ];

  const ageRangeOptions = [
    { value: '', label: 'No Filter' },
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-60', label: '46-60' },
    { value: '60+', label: '60+' },
  ];

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
      value: filters.resolved === null ? 'all' : filters.resolved ? 'true' : 'false',
      onChange: (newValue) =>
        setFilters((prev) => ({
          ...prev,
          resolved: newValue === 'all' ? null : newValue === 'true',
        })),
      options: [
        { value: 'all', label: 'All' },
        { value: 'true', label: 'Resolved' },
        { value: 'false', label: 'Unresolved' },
      ],
    },
    {
      label: 'Sex:',
      value: filters.sex,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, sex: newValue })),
      options: sexOptions,
    },
    {
      label: 'Disease:',
      value: filters.disease,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, disease: newValue })),
      options: diseaseOptions,
    },
    {
      label: 'Age Range:',
      value: filters.ageRange,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, ageRange: newValue })),
      options: ageRangeOptions,
    },
    {
      label: 'Sort By:',
      value: filters.sortBy,
      onChange: (newValue) => setFilters((prev) => ({ ...prev, sortBy: newValue })),
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
      onChange: (newValue) => setFilters((prev) => ({ ...prev, sortOrder: newValue })),
      options: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
      ],
    },
  ];

  return <Filters items={items} />;
};

export default FeedbackFilters;
