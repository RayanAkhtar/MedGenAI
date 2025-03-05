'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

interface Tag {
  id: string;
  name: string;
  isPrivate: boolean;
}

const ManageTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', isPrivate: false });

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTags`);
      if (!res.ok) throw new Error('Failed to load tags');
      const data = await res.json();
      setTags(data);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);


  // Update tag name
  const handleRename = async (id: string, name: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/updateTag/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, name } : tag)));
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  // Delete a tag
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deleteTag/${id}`, { method: 'DELETE' });
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.name.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/addTag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag),
      });
      const createdTag = await res.json();
      setTags((prev) => [...prev, createdTag]);
      setIsModalOpen(false);
      setNewTag({ name: '', isPrivate: false });
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };



  if (loading) {
    return <p className="text-center text-gray-500">Loading tags...</p>;
  }

  if (error) {
    return (
        <div>
            <Navbar />
            <div className="text-center p-8">
                <p className="text-red-500 text-lg">{error}</p>
                <button onClick={fetchTags} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Retry
                </button>
                <div className="mt-6">
                <Link href="/admin">
                    <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                    Back to Admin
                    </button>
                </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Tags</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            + Add Tag
          </button>
        </div>
  
        {/* Tags Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Tag Name</th>
              <th className="p-3 border">Edit</th>
              <th className="p-3 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-100 transition">
                <td className="p-3 border">{tag.name}</td>
                <td className="p-3 border">
                  {editingTag?.id === tag.id ? (
                    <input
                      type="text"
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ id: tag.id, name: e.target.value })}
                      onBlur={() => handleRename(tag.id, editingTag.name)}
                      className="border p-2 w-full"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingTag({ id: tag.id, name: tag.name })}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Back to Admin Button */}
        <div className="mt-6">
          <Link href="/admin">
            <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
              Back to Admin
            </button>
          </Link>
        </div>
  
        {/* Add Tag Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add New Tag</h2>
              <input
                type="text"
                placeholder="Tag name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="w-full border p-2 mb-4"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newTag.isPrivate}
                  onChange={(e) => setNewTag({ ...newTag, isPrivate: e.target.checked })}
                />
                <span>Private</span>
              </label>
              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button onClick={handleAddTag} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ManageTags;
