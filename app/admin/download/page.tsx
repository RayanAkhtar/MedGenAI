"use client"
import { useState, useEffect } from 'react';
import Link from "next/link"

const DownloadPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const [competitionCount, setCompetitionCount] = useState(0);

  const fetchDataAndDownload = async (endpoint: string, filename: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download the file');
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
    }

    setIsLoading(false);
  };

  const fetchMetaData = async () => {
    try {
      const feedbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/feedbackCount`);
      const imageRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/imageCount`);
      const leaderboardRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/leaderboardCount`);
      const competitionRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/competitionCount`);

      const feedbackData = await feedbackRes.json();
      const imageData = await imageRes.json();
      const leaderboardData = await leaderboardRes.json();
      const competitionData = await competitionRes.json();

      setFeedbackCount(feedbackData.count);
      setImageCount(imageData.count);
      setLeaderboardCount(leaderboardData.count);
      setCompetitionCount(competitionData.count);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, []);

  return (
    <div className="h-screen bg-white text-black overflow-y-auto">

      <div className="mt-10">
        <Link href="/admin">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Back to Admin
          </button>
        </Link>
      </div>

      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Data Export</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card border p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Feedback Data</h3>
            <p className="mb-4 text-gray-500">Number of Entries: {feedbackCount}</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              onClick={() => fetchDataAndDownload('/admin/downloadFeedbackData', 'feedback_data.csv')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Download Feedback Data'}
            </button>
          </div>

          <div className="card border p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Image Data</h3>
            <p className="mb-4 text-gray-500">Number of Entries: {imageCount}</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              onClick={() => fetchDataAndDownload('/admin/downloadImageData', 'image_data.csv')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Download Image Data'}
            </button>
          </div>

          <div className="card border p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Leaderboard Data</h3>
            <p className="mb-4 text-gray-500">Number of Entries: {leaderboardCount}</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              onClick={() => fetchDataAndDownload('/admin/downloadLeaderboard', 'leaderboard_data.csv')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Download Leaderboard Data'}
            </button>
          </div>

          <div className="card border p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Competition Data</h3>
            <p className="mb-4 text-gray-500">Number of Entries: {competitionCount}</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
              onClick={() => fetchDataAndDownload('/admin/downloadCompetitionData', 'competition_data.csv')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Download Competition Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
