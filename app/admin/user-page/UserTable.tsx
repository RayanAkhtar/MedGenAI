'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from '@/app/admin/Table';

interface UserTableProps {
  data: User[];
}

interface User {
  username: string;
  level: number;
  score: number;
  games_started: number;
  accuracy: number;
  engagement: number;
}

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const [users, setUsers] = useState<User[]>(data);
  console.log("Data passed to UserTable:", data);

  useEffect(() => {
    setUsers(data);
  }, [data]);  

  const columns = [
    'Username',
    'Level',
    'Score',
    'Games Started',
    'Accuracy',
    'Engagement',
    'View User'
  ];

  // A function to produce each table row (<tr>) for a given user item
  const renderRow = (item: User) => (
    <tr key={item.username} className="hover:bg-blue-100 transition-all">
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

  const getRowKey = (item: User) => item.username;
  console.log('users in parent:', users);
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