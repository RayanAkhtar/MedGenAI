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
import Link from 'next/link';

// Updated type for all profile data fields
interface UserProfileData {
  user_id: string;
  username: string;
  level: number;
  exp: number;
  games_started: number;
  games_won: number;
  score: number;
  tags?: { tagId: string; tagName: string }[]; // Updated tags field with objects containing tagId and tagName
}

export default function UserProfile() {
  const params = useParams();
  const username = params?.username as string; // Explicitly cast userId as string

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [totalImagesAttempted, setTotalImagesAttempted] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getUsers/${username}`);
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
  }, [username]);

  useEffect(() => {
    const fetchAccuracy = async () => {
      if (!username) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getAccuracyForUser/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch accuracy');
        }
        const data = await response.json();
        console.log("data is", data)
        setAccuracy(data.accuracy.toFixed(2));
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchAccuracy();
  }, [username]);

  useEffect(() => {
    const fetchTotalImagesAttempted = async () => {
      if (!username) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTotalImagesAttemptedForUser/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total images attempted');
        }
        const data = await response.json();
        setTotalImagesAttempted(data.totalImagesAttempted);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchTotalImagesAttempted();
  }, [username]);

  return (
    <div>
      <Navbar />
      <div className="mt-10">
        <Link href="/admin/user-page">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all mb-10">
            Back to User Search
          </button>
        </Link>
      </div>
      <div className="m-20 p-10">
        <h1 className="text-5xl font-bold mb-10 text-black">User Profile</h1>
        
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
            {accuracy !== null && totalImagesAttempted !== null && profile.score !== null && (
              <ScoreBox
                score={profile.score}
                accuracy={accuracy}
                totalImagesAttempted={totalImagesAttempted}
              />
            )}

            {/* Tags - Pass the updated tags list to the Tags component */}
            <Tags user_id={profile.user_id} />
          </div>
        )}
      </div>
    </div>
  );
}
