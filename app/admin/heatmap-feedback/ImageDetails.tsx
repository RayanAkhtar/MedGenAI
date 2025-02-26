'use client';

import React from 'react';

type ImageDetailsProps = {
  age: number | null;
  gender: string | null;
  disease: string | null;
  uploadTime: string | null;
  imagePath: string | null;
  imageType: string | null;
};

const ImageDetails: React.FC<ImageDetailsProps> = ({
  age,
  gender,
  disease,
  uploadTime,
  imagePath,
  imageType
}) => {
  return (
    <div className="mt-20 max-w-3xl mx-auto text-black">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl text-black font-semibold text-center mb-6">Image Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Image name:</p>
            <p>{imagePath?.split("/").pop() ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Image Type:</p>
            <p>{imageType ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Gender:</p>
            <p>{gender ?? 'Unknown'}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Age:</p>
            <p>{age ?? 'Unknown'}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Disease:</p>
            <p>{disease ?? 'Unknown'}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="font-semibold text-gray-700">Upload Time:</p>
            <p>{uploadTime ?? 'N/A'}</p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ImageDetails;
