'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import UserTable from '@/app/admin/user-page/UserTable';
import UserFilters, { FiltersState } from '@/app/admin/user-page/UserFilters';
import Pagination from '@/app/admin/Pagination';
import AssignButton from '@/app/admin/users/[username]/components/AssignButton';

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
  const [filters, setFilters] = useState<FiltersState>({
    tags: [],
    all: 'any',
    sortBy: 'username',
    sortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const limit = 2;

  const fetchUserCount = useCallback(async () => {
    try {
      const tagsParam = filters.tags.length > 0 
        ? filters.tags
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join('&')
        : '';
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/count-users-by-tags?${tagsParam}&all=${filters.all == 'all'}`
      console.log(url);
      const response = await fetch(url);
      const result = await response.json();
      setTotalPages(Math.ceil(result['count'] / limit));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [filters]);

  const fetchData = useCallback(async () => {
    try {
      const tagsParam = filters.tags.length > 0
        ? filters.tags
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join('&')
        : '';
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/filter-users?${tagsParam}&all=${filters.all == 'all'}&sort_by=${filters.sortBy}&desc=${filters.sortOrder === 'desc'}&limit=${limit}&offset=${(currentPage - 1) * limit}`;
      console.log(url);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchUserCount();
    fetchData();
  }, [filters, currentPage, fetchUserCount, fetchData])

  useEffect(() => {
    setCurrentPage(1);
    setSelectedUsers([]);
  }, [filters])

  const handleSelectUser = (checked: boolean, user: User) => {
    setSelectedUsers((prev) => {
      if (checked) {
        // Add user if not already selected
        const alreadySelected = prev.some((u) => u.username === user.username);
        return alreadySelected ? prev : [...prev, user];
      } else {
        // Else remove them
        return prev.filter((u) => u.username !== user.username);
      }
    });
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="mt-10">
        <Link href="/admin">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all mb-10">
            Back to Admin
          </button>
        </Link>
      </div>
      <div className="h-screen bg-white text-black">
        <h1 className="text-3xl font-bold text-center py-8">Users</h1>
        <UserFilters filters={filters} setFilters={setFilters} />
        <div className="flex justify-end mb-4 mr-8">
          <AssignButton
            usernames={selectedUsers.map((u) => u.username)}
          />
        </div>
        <UserTable 
          data={data} 
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UserPage;
