'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Feedback } from '@/app/types/Feedback';
import Table from '@/app/admin/Table';

interface FeedbackTableProps {
  data: Feedback[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ data }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(data);

  useEffect(() => {
    setFeedbacks(data);
  }, [data]);

  const resolveFeedback = async (feedbackId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/resolveAllFeedbackByImage/${feedbackId}`,
        { method: 'POST' }
      );
      if (response.ok) {
        setFeedbacks((prev) =>
          prev.map((f) =>
            f.image_id === feedbackId ? { ...f, unresolved_count: 0 } : f
          )
        );
      } else {
        console.error('Failed to resolve feedback');
      }
    } catch (err) {
      console.error('Error resolving feedback:', err);
    }
  };

  const columns = [
    'Image',
    'Type',
    'Gender',
    'Race',
    'Age',
    'Disease',
    'Unresolved Feedback',
    'Last Feedback Time',
    'Upload Time',
    'Actions',
  ];

  // A function to produce each table row (<tr>) for a given feedback item
  const renderRow = (item: Feedback) => (
    <tr key={item.image_id} className="hover:bg-blue-100 transition-all">
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">{item.image_type}</td>
      <td className="px-6 py-4">{item.gender}</td>
      <td className="px-6 py-4">{item.race}</td>
      <td className="px-6 py-4">{item.age}</td>
      <td className="px-6 py-4">{item.disease}</td>
      <td className="px-6 py-4">{item.unresolved_count}</td>
      <td className="px-6 py-4">
        {new Date(item.last_feedback_time).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        {new Date(item.upload_time).toLocaleString()}
      </td>
      <td className="px-6 py-4 flex gap-4">
        <Link href={`/admin/heatmap-feedback?imageid=${item.image_id}`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
            View
          </button>
        </Link>
        <button
          onClick={() => resolveFeedback(item.image_id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700"
        >
          Mark Complete
        </button>
      </td>
    </tr>
  );

  const getRowKey = (item: Feedback) => item.image_id;
  return (
    <Table
      columns={columns}
      data={feedbacks}
      renderRow={renderRow}
      getRowKey={getRowKey}
    />
  );
};

export default FeedbackTable;
