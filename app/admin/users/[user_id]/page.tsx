'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

// Import our new components

import { ProgressBar } from './components/ProgressBar';
import { GameStats } from './components/GameStats';
import { ScoreBox } from './components/ScoreBox';
import { Tags } from './components/Tags';
import { BasicInformation } from './components/BasicInformation';

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
        // If data is an array, use the first object
        if (Array.isArray(data)) {
          setProfile(data[0]);
        } else {
          setProfile(data);
        }
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
      <div className="m-20 p-10">
        <h1 className="text-5xl font-bold mb-10">User Profile</h1>
        
        {loading && <p className="text-2xl">Loading...</p>}
        {error && <p className="text-red-500 text-2xl">Error: {error}</p>}
        
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Basic Info */}
            <BasicInformation username={profile.username} userId={profile.user_id} />
            
            {/* Level and XP */}
            <ProgressBar level={profile.level} exp={profile.exp} />

            {/* Game Stats */}
            <GameStats
              gamesStarted={profile.games_started}
              gamesWon={profile.games_won}
            />

            {/* Score Box */}
            <ScoreBox score={profile.score} />

            {/* Tags */}
            <Tags />
          </div>
        )}
      </div>
    </div>
  );
}
