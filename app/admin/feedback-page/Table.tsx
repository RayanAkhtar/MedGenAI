'use client';
import React from 'react';
import TableHead from '@/app/admin/feedback-page/TableHead';
import TableBody from '@/app/admin/feedback-page/TableBody';

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
  console.log("Data in GenericTableBody:", data);
  return (
    <div className="overflow-x-auto p-8 bg-white rounded-2xl shadow-lg">
      <table className="min-w-full table-auto">
        <TableHead columns={columns} />
        <TableBody data={data} renderRow={renderRow} getRowKey={getRowKey} />
      </table>
    </div>
  );
}

export default Table;