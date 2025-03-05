'use client';
import React from 'react';

interface TableHeadProps {
  columns: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ columns }) => {
  return (
    <thead className="sticky top-0 z-30 bg-blue-500 shadow-md">
      <tr className="text-white">
        {columns.map((col) => (
          <th key={col} className="px-6 py-4 text-left bg-blue-500">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
