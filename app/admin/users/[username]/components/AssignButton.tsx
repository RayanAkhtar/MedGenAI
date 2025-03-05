import { useState } from 'react';

interface AssignButtonProps {
    userIds: string[];
    gameId: string;
}

export default function AssignButton({ userIds, gameId }: AssignButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    setFailed(false);  // Reset failure state before new request

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/newGameSession/multi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            game_id: gameId,
            user_ids: userIds
          })
        }
      );

      if (!response.ok) {
        setFailed(true);
      }
    } catch (error) {
      console.error('Error assigning users:', error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAssign}
      disabled={loading}
      className={`px-4 py-2 ${
        loading ? 'bg-gray-400' : failed ? 'bg-red-500' : 'bg-[var(--heartflow-red)]'
      } text-white rounded hover:bg-[var(--heartflow-blue)] transition-colors`}
    >
      {loading ? 'Assigning...' : failed ? 'Assign Failed' : 'Assign'}
    </button>
  );
}
