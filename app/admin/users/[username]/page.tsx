'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

// Import your components
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

// New interface for game data
interface GameData {
  game_id: number;
  game_mode: string;
  date_created: string;
  game_board: string;
  game_status: string;
  expiry_date: string | null;
  created_by: string;
  error: string;
}

export default function UserProfile() {
  const params = useParams();
  const username = params?.username as string;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Game fetch error
  const [gameError, setGameError] = useState<string | null>(null);

  // State for popover (modal)
  const [showAssignGameModal, setShowAssignGameModal] = useState<boolean>(false);

  // Store the code typed by the admin
  const [gameCode, setGameCode] = useState<string>('');

  // Store the fetched game data
  const [fetchedGame, setFetchedGame] = useState<GameData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getUsers/${username}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data: UserProfileData[] = await response.json();
        console.log(`Username: ${username}`);

        if (!data[0].username) {
          throw new Error(
            `Failed to fetch profile. Username not found: ${username}`
          );
        }

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

  // --- Function to fetch game data by code ---
  const handleFind = async () => {
    if (!gameCode) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getGame/${gameCode}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch game with code: ${gameCode}`);
      }
      const gameData: GameData[] = await res.json();

      if (gameData[0].error) {
        throw new Error(`Failed to fetch game with code: ${gameCode}`);
      }

      setGameError(null);
      setFetchedGame(gameData[0]);
      console.log('Game data fetched:', gameData);
    } catch (err) {
      setGameError((err as Error).message);
      setFetchedGame(null); // reset any previously fetched data
    }
  };

  // --- Function to handle "Assign" button click ---
  const handleAssign = async () => {
    // Here, do your "assign game" logic, e.g.:
    // - call an API endpoint to assign the game to the user
    // - handle success or error states
    // For now, we'll just log and close the popover:

    console.log('Assigning game:', fetchedGame?.game_id, 'to user:', username);
    // Example: 
    // const assignRes = await fetch(...)

    // Once done, you can close the modal or show a success message
    setShowAssignGameModal(false);
    setFetchedGame(null);
    setGameCode('');
  };

  return (
    <div>
      <Navbar />
      <div className="m-20 p-10">
        <div className="grid grid-cols-2">
          <h1 className="text-5xl font-bold mb-10">User Profile</h1>
          {!error && !loading && (
            <div className="flex justify-end items-center">
              {/* Button to open the Assign Game popover */}
              <button
                className="px-4 py-2 bg-[var(--heartflow-red)] text-white w-[30%] h-[60%] rounded-[25px]
                hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                onClick={() => {
                  setGameError(null);   // Reset error every time we open
                  setFetchedGame(null); // Reset any fetched data
                  setGameCode('');      // Reset input
                  setShowAssignGameModal(true);
                }}
              >
                Assign New Game
              </button>
            </div>
          )}
        </div>

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

      {/* ------------------------------------------------------------------------
         POPUP / MODAL for "Assign Game"
         ------------------------------------------------------------------------ */}
      {showAssignGameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Modal content */}
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            {/* If we have not fetchedGame, show the input + "Find" button.
                Otherwise, show the game details + "Assign" button. */}
            {!fetchedGame ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Enter Code</h2>

                {gameError && <p className="text-red-500 mb-4">{gameError}</p>}

                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  placeholder="Game code..."
                  className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAssignGameModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFind}
                    className="px-4 py-2 bg-[var(--heartflow-red)] text-white rounded hover:bg-[var(--heartflow-blue)] transition-colors"
                  >
                    Find
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Game Found: {fetchedGame.game_id}
                </h2>

                {/* Display game details nicely */}
                <div className="mb-4">
                  <p><strong>Game Mode:</strong> {fetchedGame.game_mode}</p>
                  <p><strong>Date Created:</strong> {fetchedGame.date_created}</p>
                  <p><strong>Game Board:</strong> {fetchedGame.game_board}</p>
                  <p><strong>Game Status:</strong> {fetchedGame.game_status}</p>
                  <p><strong>Expiry Date:</strong> {fetchedGame.expiry_date || 'N/A'}</p>
                  <p><strong>Created By:</strong> {fetchedGame.created_by}</p>
                </div>

                {/* Buttons to close or assign */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAssignGameModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleAssign}
                    className="px-4 py-2 bg-[var(--heartflow-red)] text-white rounded hover:bg-[var(--heartflow-blue)] transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
