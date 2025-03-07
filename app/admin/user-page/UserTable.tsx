'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from '@/app/admin/Table';

interface UserTableProps {
  data: User[];
  selectedUsers: User[];
  onSelectUser: (checked: boolean, user: User) => void;
}

interface User {
  username: string;
  level: number;
  score: number;
  games_started: number;
  accuracy: number;
  engagement: number;
}

const UserTable: React.FC<UserTableProps> = ({ data, selectedUsers, onSelectUser }) => {
  const [users, setUsers] = useState<User[]>(data);

  useEffect(() => {
    setUsers(data);
  }, [data]);  

  const columns = [
    'Select',
    'Username',
    'Level',
    'Score',
    'Games Started',
    'Accuracy',
    'Engagement',
    'View User'
  ];

  // A function to produce each table row (<tr>) for a given user item
  const renderRow = (item: User) => {
    const isSelected = selectedUsers.some((u) => u.username === item.username);

    return (
      <tr key={item.username} className="hover:bg-blue-100 transition-all">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectUser(e.target.checked, item)}
          />
        </td>
        <td className="px-6 py-4">{item.username}</td>
        <td className="px-6 py-4">{item.level}</td>
        <td className="px-6 py-4">{item.score}</td>
        <td className="px-6 py-4">{item.games_started}</td>
        <td className="px-6 py-4">{item.accuracy}</td>
        <td className="px-6 py-4">{item.engagement}</td>
        <td className="px-6 py-4">
          <Link href={`/admin/users/${item.username}`}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
              View
            </button>
          </Link>
        </td>
      </tr>
    );
  };

  const getRowKey = (item: User) => item.username;
  return (
    <Table
      columns={columns}
      data={users}
      renderRow={renderRow}
      getRowKey={getRowKey}
    />
  );
};

export default UserTable;