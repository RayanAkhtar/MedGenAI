'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Feedback {
  image_id: string;
  image_type: string;
  unresolved_count: number;
  last_feedback_time: string;
  upload_time: string;
  image_path: string;
}

interface DataTableProps {
  data: Feedback[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const resolveFeedback = async (feedbackId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/resolveAllFeedbackByImage/${feedbackId}`,
        {
          method: 'POST',
        }
      );
      if (response.ok) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.image_id === feedbackId
              ? { ...feedback, unresolved_count: 0 }
              : feedback
          )
        );
      } else {
        console.error('Failed to resolve feedback');
      }
    } catch (error) {
      console.error('Error resolving feedback:', error);
    }
  };

  return (
    <div className='overflow-x-auto p-8 bg-white rounded-2xl shadow-lg'>
      <table className='min-w-full table-auto'>
        <thead>
          <tr className='bg-blue-500 text-white'>
            <th className='px-6 py-4 text-left'>Image</th>
            <th className='px-6 py-4 text-left'>Image Type</th>
            <th className='px-6 py-4 text-left'>Unresolved Feedback</th>
            <th className='px-6 py-4 text-left'>Last Feedback Time</th>
            <th className='px-6 py-4 text-left'>Upload Time</th>
            <th className='px-6 py-4 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.image_id} className='hover:bg-blue-100 transition-all'>
              <td className='px-6 py-4'>
                {item.image_path ? (
                  <Image
                    src={item.image_path}
                    alt={item.image_id}
                    width={100}
                    height={100}
                  />
                ) : (
                  <span>Loading...</span>
                )}
              </td>
              <td className='px-6 py-4'>{item.image_type}</td>
              <td className='px-6 py-4'>{item.unresolved_count}</td>
              <td className='px-6 py-4'>
                {new Date(item.last_feedback_time).toLocaleString()}
              </td>
              <td className='px-6 py-4'>
                {new Date(item.upload_time).toLocaleString()}
              </td>
              <td className='px-6 py-4 flex gap-4'>
                <Link href={`/admin/heatmap-feedback?imageid=${item.image_id}`}>
                  <button className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700'>
                    View
                  </button>
                </Link>
                <button
                  onClick={() => resolveFeedback(item.image_id)}
                  className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700'
                >
                  Mark Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
