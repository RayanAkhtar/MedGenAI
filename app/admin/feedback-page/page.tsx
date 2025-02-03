"use client";

import Navbar from '@/app/components/Navbar';
import { useState, useEffect } from 'react';

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [imageType, setImageType] = useState('all');
    const [resolved, setResolved] = useState(null);
    const [sortBy, setSortBy] = useState('last_feedback_time');


    const fetchFeedbacks = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbacks?image_type=${imageType}&resolved=${resolved}&sort_by=${sortBy}`);
        const data = await response.json();
        console.log("data is", data)
        setFeedbacks(data);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [imageType, resolved, sortBy]);

    return (
        <div>
            <Navbar />
            <div className="h-screen bg-white text-[var(--foreground)] overflow-y-auto text-black">
                <h1 className="text-3xl font-bold text-center py-8">Feedback Page</h1>


                <div className="flex flex-wrap gap-6 justify-center p-8 bg-white rounded-2xl shadow-lg mb-8">
                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                        <label className="font-bold text-lg">Image Type:</label>
                        <select
                            onChange={(e) => setImageType(e.target.value)}
                            value={imageType}
                            className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]"
                        >
                            <option value="all">All</option>
                            <option value="real">Real</option>
                            <option value="ai">AI</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                        <label className="font-bold text-lg">Resolved:</label>
                        <select
                            onChange={(e) => setResolved(e.target.value === 'all' ? null : e.target.value === 'true')}
                            value={resolved === null ? 'all' : resolved ? 'true' : 'false'}
                            className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]"
                        >
                            <option value="all">All</option>
                            <option value="true">Resolved</option>
                            <option value="false">Unresolved</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                        <label className="font-bold text-lg">Sort By:</label>
                        <select
                            onChange={(e) => setSortBy(e.target.value)}
                            value={sortBy}
                            className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]"
                        >
                            <option value="last_feedback_time">Time of Last Feedback</option>
                            <option value="unresolved_count">Amount of Unresolved Feedback</option>
                            <option value="upload_time">Time of Image Upload</option>
                            <option value="image_id">Image ID</option>
                        </select>
                    </div>
                </div>


                <div className="overflow-x-auto p-8 bg-white rounded-2xl shadow-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-[var(--heartflow-blue)] text-white">
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Image Type</th>
                                <th className="px-6 py-4 text-left">Unresolved Feedback</th>
                                <th className="px-6 py-4 text-left">Last Feedback Time</th>
                                <th className="px-6 py-4 text-left">Upload Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <tr key={feedback.image_id} className="hover:bg-[var(--heartflow-blue)]/10 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <img src={`/uploads/${feedback.image_path}`} alt={feedback.image_id} width={100} />
                                    </td>
                                    <td className="px-6 py-4">{feedback.image_type}</td>
                                    <td className="px-6 py-4">{feedback.unresolved_count}</td>
                                    <td className="px-6 py-4">{new Date(feedback.last_feedback_time).toLocaleString()}</td>
                                    <td className="px-6 py-4">{new Date(feedback.upload_time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
