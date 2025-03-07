'use client';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className='flex justify-center gap-4 pt-6 bg-white'>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className='px-4 py-2 bg-gray-500 text-white rounded-full disabled:bg-gray-300'
      >
        Previous
      </button>
      <span className='px-4 py-2 text-lg'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className='px-4 py-2 bg-gray-500 text-white rounded-full disabled:bg-gray-300'
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
