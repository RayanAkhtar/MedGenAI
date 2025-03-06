'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface TagsProps {
  user_id: string;
}

interface Tag {
  tag_id: string;
  name: string;
}

export function Tags({ user_id }: TagsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchUserTags = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTagsForUser/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user tags');
        }
        const data: Tag[] = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Error fetching user tags:', error);
      }
    };

    fetchUserTags();
  }, [user_id]);


  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTags`);
        if (!response.ok) {
          throw new Error('Failed to fetch available tags');
        }
        const data = await response.json();
        const tagsData: Tag[] = data.map((tag: { tag_id: string; name: string }) => ({
          tag_id: tag.tag_id,
          name: tag.name,
        }));
        setAvailableTags(tagsData);
      } catch (error) {
        console.error('Error fetching available tags:', error);
      }
    };

    fetchAvailableTags();
  }, []);


  const handleAddTag = async (tag: Tag) => {
    if (!tags.find(existingTag => existingTag.tag_id === tag.tag_id)) {
      setTags([...tags, tag]);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/addTagForUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            tagId: tag.tag_id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add tag for user');
        }

      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
    setNewTag('');
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter(tag => tag.tag_id !== tagId));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deleteTagForUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user_id,
          tagId: tagId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete tag for user');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const filteredTags = availableTags
    .filter(tag => tag.name.toLowerCase().includes(newTag.toLowerCase()))
    .filter(tag => !tags.find(existingTag => existingTag.tag_id === tag.tag_id));

  return (
    <div className="p-8 border rounded-2xl shadow-lg bg-white lg:col-span-2 w-full space-y-6">
      <div className="flex justify-between items-center relative">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Tags</h2>

        <div className="relative w-full">
          <div className="flex items-center w-full">
            <input
              type="text"
              className="p-3 border-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Search or Add a Tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </div>

          {newTag && (
            <div className="mt-2 absolute left-0 right-0 max-h-48 overflow-auto bg-white shadow-lg rounded-lg border p-2 z-10">
              {filteredTags.map((tag) => (
                <button
                  key={tag.tag_id}
                  className="px-4 py-2 border-2 rounded-lg shadow-xl text-2xl font-semibold text-gray-900 text-left hover:bg-gray-100 w-full"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {tags.map((tag) => (
          <div
            key={tag.tag_id}
            className={`p-4 border-2 rounded-lg shadow-xl text-2xl font-semibold text-gray-900 text-center border-blue-500`}
          >
            <span>{tag.name}</span>
            <button
              onClick={() => handleDeleteTag(tag.tag_id)}
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
