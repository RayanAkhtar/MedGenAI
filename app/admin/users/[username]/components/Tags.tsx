'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface TagsProps {
  initialTags: string[];
}

export function Tags({ initialTags }: TagsProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  
  const availableTags = [
    'Neuro ninja', 'X-ray visionary', 'AI Antagonist', 'Diagnosis Master', 
    'Data Scientist', 'Machine Learning Expert', 'Tech Enthusiast', 'Code Master'
  ];

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTag('');
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <div className="p-8 border rounded-2xl shadow-lg bg-white lg:col-span-2 w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Tags</h2>

        <div className="flex items-center w-full relative">
          <input
            type="text"
            className="p-3 border-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search or Add a Tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
        </div>
      </div>

      {newTag && (
        <div className="mt-4 flex flex-col gap-2 max-h-48 overflow-auto bg-white shadow-lg rounded-lg border p-2 absolute w-full sm:w-72 md:w-96 z-10 mx-auto">
          {availableTags
            .filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()))
            .map((tag, index) => (
              <button
                key={index}
                className="px-4 py-2 border-2 rounded-lg shadow-xl text-2xl font-semibold text-gray-900 text-left hover:bg-gray-100"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </button>
            ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg shadow-xl text-2xl font-semibold text-gray-900 text-center`}
          >
            <span>{tag}</span>
            <button
              onClick={() => handleDeleteTag(tag)}
              className="ml-2 text-black hover:text-red-500"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
