'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

// Updated type for all profile data fields
interface UserProfileData {
  user_id: string;
  username: string;
  level: number;
  exp: number;
  games_started: number;
  games_won: number;
  score: number;
}

export default function UserProfile() {
  const params = useParams();
  const userId = params?.user_id as string; // Explicitly cast userId as string

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getUsers/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data: UserProfileData = await response.json();
        if (Array.isArray(data)) {
          setProfile(data[0]); // Extract the first object from the array
        } else {
          setProfile(data); // Set directly if not an array
        }        console.log("Data", data)
        console.log("Profile",profile); // Debugging purposes
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {profile && (
          <div className="mt-4 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{profile.username}</h2>
            <p className="text-gray-600">User ID: {profile.user_id}</p>
            <p className="text-gray-600">Level: {profile.level}</p>
            <p className="text-gray-600">Experience: {profile.exp}</p>
            <p className="text-gray-600">Games Started: {profile.games_started}</p>
            <p className="text-gray-600">Games Won: {profile.games_won}</p>
            <p className="text-gray-600">Score: {profile.score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
