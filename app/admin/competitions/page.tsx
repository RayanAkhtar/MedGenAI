"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import AdminStats from "../AdminStats";
import FeedbackPieChart from "../FeedbackPieChart";
import ImageStatsCard from "../ImageStatsCard";

// 📅 Helper function to get date 7 days from now in YYYY-MM-DD format
const getDefaultExpiryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7); // Add 7 days
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

export default function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    expiryDate: getDefaultExpiryDate(), // ⏳ Set default expiry date
    gameCode: "",
    gameType: "Single",
  });

  // 🔄 Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 🚀 Dummy submit handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Form submitted with data:", formData);
    alert("Form submitted! Check the console for form data. 🎉");
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />
      <section className="p-8 bg-white rounded-2xl shadow-md max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Create Game Competition</h2>
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Game Type</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Single">Single</option>
              <option value="Binary">Dual</option>
            </select>
          </div>

          {/* 🚀 Submit Button */}
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
