'use client';
import React from 'react';
import TableHead from '@/app/admin/TableHead';
import TableBody from '@/app/admin/TableBody';

interface GenericTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  getRowKey: (item: T, index: number) => string | number;
}

function Table<T>({
  columns,
  data,
  renderRow,
  getRowKey,
}: GenericTableProps<T>) {
  return (
    <div className="p-8 bg-white shadow-lg">
      <table className="w-full border-collapse bg-white">
        <TableHead columns={columns} />
        <TableBody data={data} renderRow={renderRow} getRowKey={getRowKey} />
      </table>
    </div>
  );
}

export default Table;
