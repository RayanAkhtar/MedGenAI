'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import UserTable from '@/app/admin/user-page/UserTable';
import UserFilters, { FiltersState } from '@/app/admin/user-page/UserFilters';
import Pagination from '@/app/admin/Pagination';
import AssignButton from '@/app/admin/users/[username]/components/AssignButton';
import AssignTagsButton from '@/app/admin/user-page/AssignTagsButton';
import User from '@/app/types/User';

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
  const [totalResults, setTotalResults] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const limit = 2;

  const fetchUserCount = useCallback(async () => {
    try {
      const tagsParam = filters.tags.length > 0 
        ? filters.tags
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join('&')
        : '';
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/count-users-by-tags?${tagsParam}&all=${filters.all === 'all'}`
      console.log(url);
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setTotalResults(result['count']);
        setTotalPages(Math.max(1, Math.ceil(result['count'] / limit)));
      }
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
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/filter-users?${tagsParam}&all=${filters.all === 'all'}&sort_by=${filters.sortBy}&desc=${filters.sortOrder === 'desc'}&limit=${limit}&offset=${(currentPage - 1) * limit}`;
      console.log(url);
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchData();
  }, [filters, currentPage, fetchData])

  useEffect(() => {
    setCurrentPage(1);
    setSelectedUsers([]);
    setSelectAll(false);
    fetchUserCount();
  }, [filters.tags, filters.all])

  const handleToggleSelectAll = () => {
    setSelectAll((prev) => !prev);
    setSelectedUsers([]);
  };
  
  const handleSelectUser = (checked: boolean, user: User) => {
    setSelectedUsers((prev) => {
      const alreadySelected = prev.some((u) => u.username === user.username);
      let updatedSelection;
  
      // If we're in "selectAll" mode, we treat "selectedUsers" as "excluded"
      if (selectAll) {
        if (checked) {
          // The user is now "checked" in the table => that means *remove* them
          // from the array (they are no longer excluded)
          updatedSelection = prev.filter((u) => u.username !== user.username);
        } else {
          // The user is now "unchecked" => that means *add* them to the array (they are excluded)
          updatedSelection = alreadySelected ? prev : [...prev, user];
        }
      }
      // Normal mode: "selectedUsers" is truly the selected users
      else {
        if (checked) {
          updatedSelection = alreadySelected ? prev : [...prev, user];
        } else {
          updatedSelection = prev.filter((u) => u.username !== user.username);
        }
      }
      if (selectAll && updatedSelection.length === totalResults) {
        console.log("Deselecting manually");
        setSelectAll(false);
        return [];
      }
      if (!selectAll && updatedSelection.length === totalResults) {
        console.log("Selecting manually");
        setSelectAll(true);
        return [];
      }

      return updatedSelection;
    });
  };

  return (
    <div className="bg-white">
      <div className="pt-10">
        <Link href="/admin">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all mb-10">
            Back to Admin
          </button>
        </Link>
      </div>
      <div className="h-screen bg-white text-black">
        <h1 className="text-3xl font-bold text-center py-8">Users</h1>
        <UserFilters filters={filters} setFilters={setFilters} />
        <div className="flex justify-between mb-4 mx-8">
          <button
            onClick={handleToggleSelectAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
          >
            {(selectAll) ? 'Deselect All' : 'Select All'}
          </button>
          <div className="flex space-x-4">
            <AssignTagsButton 
              usernames={selectedUsers.map((u) => u.username)}
              filterTags={filters.tags}
              selectAll={selectAll}
              all={filters.all === 'all'}
              totalResults={totalResults}
            />
            <AssignButton
            usernames={selectedUsers.map((u) => u.username)}
            filterTags={filters.tags}
            selectAll={selectAll}
            all={filters.all === 'all'}
            totalResults={totalResults}
          />
          </div>
        </div>
        <UserTable 
          data={data} 
          selectedUsers={selectedUsers}
          selectAll={selectAll}
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
