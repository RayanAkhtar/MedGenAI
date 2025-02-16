'use client'

import Navbar from '@/app/components/Navbar'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'


interface Feedback {
  image_id: string;
  image_type: string;
  unresolved_count: number;
  last_feedback_time: string;
  upload_time: string;
  image_path: string;
}


const FeedbackPage = () => {
  const filter = useSearchParams()?.get("filter");

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [imageType, setImageType] = useState<string>(filter == "real" ? "real" : filter == "ai" ? "ai" : "all")
  const [resolved, setResolved] = useState<boolean | null>(filter == "complete" ? true : filter == "false" ? false : null)
  const [sortBy, setSortBy] = useState<string>('last_feedback_time') 
  const [sortOrder, setSortOrder] = useState<string>('asc')
  const [images, setImages] = useState<{ [key: string]: string }>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchFeedbacks = async (page = 1): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbacks?image_type=${imageType}&resolved=${resolved}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&limit=20` // Added sort_order
    )
    const data = await response.json()
    setFeedbacks(data)
  }

  const fetchFeedbackCount = async (): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbackCount?image_type=${imageType}&resolved=${resolved}`
    )
    const data: { total_count: number } = await response.json()

    setTotalPages(Math.ceil(data.total_count / 20))
  }

  const fetchImage = async (imagePath: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/view/${encodeURIComponent(imagePath)}`
      )
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      return url
    } catch (error) {
      console.error('Error fetching image:', error)
      return null
    }
  }

  const resolveFeedback = async (feedbackId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/resolveAllFeedbackByImage/${feedbackId}`,
        {
          method: 'POST',
        }
      )
  
      if (response.ok) {
        setFeedbacks(prevFeedbacks =>
          prevFeedbacks.map(feedback =>
            feedback.image_id === feedbackId
              ? { ...feedback, unresolved_count: 0 }
              : feedback
          )
        )
      } else {
        console.error('Failed to resolve feedback');
        console.log("response is", response)
      }
    } catch (error) {
      console.error('Error resolving feedback:', error);
    }
  }
  

  useEffect(() => {
    fetchFeedbacks(currentPage)
    fetchFeedbackCount()
  }, [imageType, resolved, sortBy, sortOrder, currentPage])

  useEffect(() => {
    const loadImages = async (): Promise<void> => {
      const newImages: { [key: string]: string } = {}

      for (const feedback of feedbacks) {
        if (!newImages[feedback.image_id]) {
          const imageUrl = await fetchImage(feedback.image_path)
          if (imageUrl) {
            newImages[feedback.image_id] = imageUrl
          }
        }
      }
      setImages(newImages)
    }

    if (feedbacks.length > 0) {
      loadImages()
    }
  }, [feedbacks])

  const goToPage = (page: number): void => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchFeedbacks(page);
  };

  return (
    <div className='bg-white'>
      <Navbar />

      <div className="mt-10">
        <Link href="/admin">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Back to Admin
          </button>
        </Link>
      </div>

      <div className='h-screen bg-white text-[var(--foreground)] overflow-y-auto text-black'>
        <h1 className='text-3xl font-bold text-center py-8'>Feedback Page</h1>
        <div className='flex flex-wrap gap-6 justify-center p-8 bg-white rounded-2xl shadow-lg mb-8'>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <label className='font-bold text-lg'>Image Type:</label>
            <select
              onChange={e => setImageType(e.target.value)}
              value={imageType}
              className='px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]'
            >
              <option value='all'>All</option>
              <option value='real'>Real</option>
              <option value='ai'>AI</option>
            </select>
          </div>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <label className='font-bold text-lg'>Resolved:</label>
            <select
              onChange={e =>
                setResolved(
                  e.target.value === 'all' ? null : e.target.value === 'true'
                )
              }
              value={resolved === null ? 'all' : resolved ? 'true' : 'false'}
              className='px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]'
            >
              <option value='all'>All</option>
              <option value='true'>Resolved</option>
              <option value='false'>Unresolved</option>
            </select>
          </div>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <label className='font-bold text-lg'>Sort By:</label>
            <select
              onChange={e => setSortBy(e.target.value)}
              value={sortBy}
              className='px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]'
            >
              <option value='last_feedback_time'>Time of Last Feedback</option>
              <option value='unresolved_count'>
                Amount of Unresolved Feedback
              </option>
              <option value='upload_time'>Time of Image Upload</option>
              <option value='image_id'>Image ID</option>
            </select>
          </div>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <label className='font-bold text-lg'>Sort Order:</label>
            <select
              onChange={e => setSortOrder(e.target.value)}
              value={sortOrder}
              className='px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--heartflow-blue)]'
            >
              <option value='asc'>Ascending</option>
              <option value='desc'>Descending</option>
            </select>
          </div>
        </div>

        <div className='overflow-x-auto p-8 bg-white rounded-2xl shadow-lg'>
          <table className='min-w-full table-auto'>
            <thead>
              <tr className="bg-[var(--heartflow-blue)] text-white">
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Image Type</th>
                <th className="px-6 py-4 text-left">Unresolved Feedback</th>
                <th className="px-6 py-4 text-left">Last Feedback Time</th>
                <th className="px-6 py-4 text-left">Upload Time</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map(feedback => (
                <tr
                  key={feedback.image_id}
                  className='hover:bg-[var(--heartflow-blue)]/10 transition-all duration-300'
                >
                  <td className='px-6 py-4'>
                    {images[feedback.image_id] ? (
                      <img
                        src={images[feedback.image_id]}
                        alt={feedback.image_id}
                        width={100}
                      />
                    ) : (
                      <span>Loading...</span>
                    )}
                  </td>
                  <td className='px-6 py-4'>{feedback.image_type}</td>
                  <td className='px-6 py-4'>{feedback.unresolved_count}</td>
                  <td className='px-6 py-4'>
                    {new Date(feedback.last_feedback_time).toLocaleString()}
                  </td>
                  <td className='px-6 py-4'>
                    {new Date(feedback.upload_time).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 flex gap-4'>
                    <Link
                      href={`/admin/heatmap-feedback?imageid=${feedback.image_id}`}
                    >
                      <button className='px-4 py-2 bg-[var(--heartflow-blue)] text-white rounded-full hover:bg-blue-700 focus:outline-none'>
                        View Heatmap Feedback
                      </button>
                    </Link>
                    <button
                      onClick={() => resolveFeedback(feedback.image_id)}
                      className='px-4 py-2 bg-[var(--heartflow-blue)] text-white rounded-full hover:bg-blue-700 focus:outline-none'
                    >
                      Mark Feedback as Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded-full disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-500 text-white rounded-full disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage
