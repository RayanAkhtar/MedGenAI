'use client'; 

import React, { useEffect, useState, useRef } from 'react';

interface TagModalProps {
  onClose: () => void; 
  onConfirm: (selectedTags: string[]) => void;
}

const TagModal: React.FC<TagModalProps> = ({ onClose, onConfirm }) => {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tags?admin_only=true`;
        const response = await fetch(url);
        if (!response.ok) {
          console.error('Failed to fetch tags');
          return;
        }
        const result = await response.json();
        setAllTags(result);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleTagChange = (checked: boolean, tag: string) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };

  const handleConfirmClick = () => {
    onConfirm(selectedTags);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-xl mb-4">Select Tags</h2>
        {allTags.length === 0 && (
          <div className="text-gray-500 mb-4">No tags available.</div>
        )}
        {allTags.map((tag) => (
          <label
            key={tag}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={tag}
              onChange={(e) => handleTagChange(e.target.checked, tag)}
              className="cursor-pointer"
            />
            <span>{tag}</span>
          </label>
        ))}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagModal;