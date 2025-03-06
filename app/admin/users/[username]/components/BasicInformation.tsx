'use client';

import React from 'react';

interface BasicInformationProps {
  username: string;
  userId: string;
}

export function BasicInformation({ username, userId }: BasicInformationProps) {
  return (
    <div className="p-10 border rounded-2xl shadow-lg bg-white w-full">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Basic Information</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between p-5 bg-gray-100 rounded-lg shadow-md">
          <span className="text-2xl text-gray-600 font-semibold">Username</span>
          <span className="text-3xl font-bold text-gray-900 break-words max-w-[50%] sm:max-w-full truncate">
            {username}
          </span>
        </div>
        <div className="flex items-center justify-between p-5 bg-gray-100 rounded-lg shadow-md">
          <span className="text-2xl text-gray-600 font-semibold">User ID</span>
          <span className="text-3xl font-mono text-blue-600 break-words max-w-[50%] sm:max-w-full truncate">
            {userId}
          </span>
        </div>
      </div>
    </div>
  );
}
