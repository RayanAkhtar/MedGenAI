"use client";

import { useState } from "react";

// Helper function to get date 7 days from now in YYYY-MM-DD format
const getDefaultExpiryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7); // Add 7 days
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

interface FormData {
  name: string;
  expiryDate: string;
  gameCode: string;
}

export default function Admin() {
  const params = new URLSearchParams(window.location.search);
  const game_code = params.get("game_code") || "";
  const [formData, setFormData] = useState<FormData>({
    name: "",
    expiryDate: getDefaultExpiryDate(),
    gameCode: game_code,
  });

  const [errors, setErrors] = useState<{ name?: string; expiryDate?: string; gameCode?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Form validation function
  const validateForm = () => {
    const newErrors: { name?: string; expiryDate?: string; gameCode?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Competition name is required.";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required.";
    if (!formData.gameCode.trim()) newErrors.gameCode = "Game code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler with validation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    const data = {
      name: formData.name,
      expiry: `${formData.expiryDate} 00:00:00`, // Keep time as midnight
      game_code: formData.gameCode,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/competitions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Response:", result);
        setSuccessMessage("Competition created successfully! 🎉");

        // Reset the form
        setFormData({
          name: "",
          expiryDate: getDefaultExpiryDate(),
          gameCode: "",
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto text-black">
      <section className="p-8 bg-white rounded-2xl shadow-md max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Create Game Competition</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Competition Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Game Code</label>
            <input
              type="text"
              name="gameCode"
              value={formData.gameCode}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Enter Game Code"
            />
            {errors.gameCode && <p className="text-red-500 text-sm mt-1">{errors.gameCode}</p>}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Create Competition
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
