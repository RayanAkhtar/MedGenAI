'use client';
import React from 'react';

interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T) => React.ReactNode; 
  getRowKey: (item: T, index: number) => string | number; 
}

function TableBody<T>({ data, renderRow, getRowKey }: TableBodyProps<T>) {
  return (
    <tbody className="relative z-10 bg-white">
      {data.map((item, index) => {
        const key = getRowKey(item, index);
        return <React.Fragment key={key}>{renderRow(item)}</React.Fragment>;
      })}
    </tbody>
  );
}

export default TableBody;
