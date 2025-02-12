'use client'

import { useState, useEffect } from 'react'

interface ImageDifficultyProps {
  sampleDifficulty: { image_id: string; difficulty_score: string; image_path: string; total_guesses: number; incorrect_guesses: number}[];
}

const SampleDifficulty = ({ sampleDifficulty }: ImageDifficultyProps) => {
  console.log("passed in", sampleDifficulty)

  const [images, setImages] = useState<{ [key: string]: string }>({});

  const fetchImage = async (imagePath: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/view/${encodeURIComponent(imagePath)}`
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const newImages: { [key: string]: string } = {};
      for (const sample of sampleDifficulty) {
        if (!newImages[sample.image_id]) {
          const imageUrl = await fetchImage(sample.image_path);
          if (imageUrl) {
            newImages[sample.image_id] = imageUrl;
          }
        }
      }
      setImages(newImages);
    };

    loadImages();

    console.log("sample difficulty:", sampleDifficulty)
  }, [sampleDifficulty]);

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-center mb-6">Image Difficulty</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Image</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Image ID</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Difficulty Score</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Total Guesses</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Incorrect Guesses</th>
            </tr>
          </thead>
          <tbody>
            {sampleDifficulty.map((sample, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-sm">
                  {images[sample.image_id] ? (
                    <img src={images[sample.image_id]} alt={sample.image_id} width={50} />
                  ) : (
                    <span>Loading...</span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm">{sample.image_id}</td>
                <td className="px-4 py-2 text-sm">{parseFloat(sample.difficulty_score).toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">{sample.total_guesses}</td>
                <td className="px-4 py-2 text-sm">{sample.incorrect_guesses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleDifficulty;
