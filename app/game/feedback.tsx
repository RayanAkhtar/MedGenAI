import { useState } from "react";

export default function FeedbackBox() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (feedback.trim() === "") return;

    try {
      // Dummy values used for now
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageID: "img123",
          userID: "user456",
          user_guess_type: "right",
          x: 150,
          y: 250,
          feedback: feedback 
        }),
      });

      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-2xl">
      <div>
        <h2 className="text-xl font-bold mb-2 text-black">Submit Feedback</h2>
        {submitted ? (
          <p className="text-green-600">Thank you for your feedback!</p>
        ) : (
          <>
            <textarea
              className="w-full p-2 border rounded-md text-black"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md" onClick={handleSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}