'use client';
import React from 'react';

interface TableHeadProps {
  columns: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ columns }) => {
  return (
    <thead>
      <tr className="bg-blue-500 text-white">
        {columns.map((col) => (
          <th key={col} className="px-6 py-4 text-left">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;