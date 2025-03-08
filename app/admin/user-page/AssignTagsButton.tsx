'use client';

import React, { useState } from 'react';
import TagModal from '@/app/admin/user-page/TagModal';

interface AssignTagsButtonProps {
  usernames: string[];
}

export default function AssignTagsButton({ usernames }: AssignTagsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    if (usernames.length === 0) {
      alert('Please select at least one user to assign tags!');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAssignTags = async (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      alert('Please select at least one tag.');
      return;
    }
    setLoading(true);
    setFailed(false);
    setSuccess(false);
    setShowModal(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/assignTags`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usernames,
            tags: selectedTags
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to assign tags. Please try again.');
        setFailed(true);
        setTimeout(() => setFailed(false), 2000);
      }
    } catch (error) {
      console.error('Error assigning tags:', error);
      alert('Network error. Please try again later.');
      setFailed(true);
      setTimeout(() => setFailed(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleOpenModal}
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
            : 'bg-purple-500'
        } text-white rounded hover:${
          usernames.length === 0 ? 'bg-gray-300' : 'bg-purple-600'
        } transition-colors`}
      >
        {loading
          ? 'Assigning...'
          : failed
          ? 'Assign Failed'
          : success
          ? 'Assigned!'
          : 'Assign Tags'}
      </button>

      {showModal && (
        <TagModal
          onClose={handleCloseModal}
          onConfirm={handleAssignTags}
        />
      )}
    </div>
  );
}
