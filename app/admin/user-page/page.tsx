'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import UserTable from '@/app/admin/user-page/UserTable';
import Pagination from '@/app/admin/Pagination';
import UserFilters from '@/app/admin/user-page/UserFilters';

interface User {
  username: string;
  level: number;
  score: number;
  games_started: number;
  accuracy: number;
  engagement: number;
}

const UserPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    tags: 'Lung Legend',
    all: false,
    sortBy: 'level',
    sortOrder: 'desc',
  });

  const fetchData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/filter-users?tags=${filters.tags}&all=${filters.all}&sort_by=${filters.sortBy}&desc=${filters.sortOrder === 'desc'}`;
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters])

  return (
    <div className="bg-white">
      <Navbar />
      <div className="mt-10">
        <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all">
          Back to Admin
        </button>
      </div>
      <div className="h-screen bg-white text-black overflow-y-auto">
        <h1 className="text-3xl font-bold text-center py-8">User Page</h1>

        <UserFilters filters={filters} setFilters={setFilters} />
        <UserTable data={data} />
      </div>
    </div>
  );
};

export default UserPage;
