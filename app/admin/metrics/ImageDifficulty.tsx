interface SampleDifficultyProps {
    sampleDifficulty: { sampleId: string; difficultyScore: number }[];
  }
  
  const SampleDifficulty = ({ sampleDifficulty }: SampleDifficultyProps) => {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-center mb-6">Image Difficulty</h3>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Sample</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Difficulty Score</th>
              </tr>
            </thead>
            <tbody>
              {sampleDifficulty.map((sample, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm">{sample.sampleId}</td>
                  <td className="px-4 py-2 text-sm">{sample.difficultyScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default SampleDifficulty;
  