import { useState } from 'react';

interface AssignButtonProps {
    usernames: string[];
    gameCode: string;
}

export default function AssignButton({ usernames }: AssignButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSelectMessage, setShowSelectMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameCode, setGameCode] = useState('');

  const handleAssign = async () => {
    if (usernames.length === 0) { // Show message if no users are selected
      setShowSelectMessage(true);
      setTimeout(() => setShowSelectMessage(false), 2000); 
      return;
    }

    setShowModal(true);
  }
  
  const handleConfirmAssign = async () => {
    if (gameCode.trim() === '') {
      alert('Please enter a valid game code.');
      return;
    }

    setLoading(true);
    setFailed(false);  // Reset failure state before new request
    setSuccess(false);
    setShowModal(false); 

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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl mb-4">Enter Game Code</h2>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Game Code"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
