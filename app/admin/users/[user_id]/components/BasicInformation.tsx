'use client';

import React from 'react';

interface BasicInformationProps {
  username: string;
  userId: string;
}

export function BasicInformation({ username, userId }: BasicInformationProps) {
  return (
    <div className="p-10 border rounded-lg shadow-md text-2xl">
      <h2 className="text-3xl font-semibold">Basic Information</h2>
      <p className="text-gray-600">Username: {username}</p>
      <p className="text-gray-600">User ID: {userId}</p>
    </div>
  );
}
