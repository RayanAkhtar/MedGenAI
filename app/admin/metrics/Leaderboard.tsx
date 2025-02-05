interface LeaderboardProps {
    leaderboardData: { user: string; accuracy: number }[];
  }
  
  const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-center mb-6">Leaderboard</h3>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">User</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{user.user}</td>
                  <td className="px-4 py-2 text-sm">{(user.accuracy * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;
  