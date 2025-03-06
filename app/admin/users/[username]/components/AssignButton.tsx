import { useState } from 'react';

interface AssignButtonProps {
    usernames: string[];
    gameCode: string;
}

export default function AssignButton({ usernames, gameCode }: AssignButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSelectMessage, setShowSelectMessage] = useState(false);

  const handleAssign = async () => {
    if (usernames.length === 0) { // Show message if no users are selected
      setShowSelectMessage(true);
      setTimeout(() => setShowSelectMessage(false), 2000); 
      return;
    }
    
    setLoading(true);
    setFailed(false);  // Reset failure state before new request
    setSuccess(false);

    try {
      console.log("gameID:", gameCode);
      console.log("usernames:", usernames);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/newGameSession/multi`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            game_code: gameCode,
            usernames: usernames
          })
        }
      );

      if (response.ok) {
        setSuccess(true);  
        setTimeout(() => setSuccess(false), 2000);
      }
      else {
        setFailed(true);
        setTimeout(() => setFailed(false), 2000);
      }
    } catch (error) {
      console.error('Error assigning users:', error);
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleAssign}
        disabled={loading}
        className={`px-4 py-2 ${
          loading 
            ? 'bg-gray-400' 
            : failed 
            ? 'bg-red-500'
            : success
            ? 'bg-green-500'
            : usernames.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[var(--heartflow-red)]'
        } text-white rounded hover:${
          usernames.length === 0 ? 'bg-gray-300' : 'bg-[var(--heartflow-blue)]'
        } transition-colors`}
      >
        {loading ? 'Assigning...' : failed ? 'Assign Failed' : success ? 'Assigned!' : 'Assign Game'}
      </button>
      {showSelectMessage && (
        <span className="text-red-500 text-sm mt-2">
          Please select at least one user to assign!
        </span>
      )}
    </div>
  );
}
