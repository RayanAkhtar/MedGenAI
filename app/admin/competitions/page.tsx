"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";


// 📅 Helper function to get date 7 days from now in YYYY-MM-DD format
const getDefaultExpiryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7); // Add 7 days
  return today; // Format: YYYY-MM-DD
};

interface FormData {
  name: string;
  expiryDate: Date;
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

  // Handle form input changes with proper typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit handler with API integration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // try {
    //   const user = auth.currentUser;
    //   if (!user) {
    //     throw new Error("No user logged in");
    //   }

    //   const idToken = await user.getIdToken(true);

    //   const date = new Date("2025-03-14").toISOString().slice(0, 19).replace('T', ' ');
      
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/competition/create`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${idToken}`
    //     },
    //     body: JSON.stringify({
    //       game_code: formData.gameCode,
    //       name: formData.name,
    //       // expiry: formData.expiryDate,
    //       expiry: date
    //     })
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Failed to create competition');
    //   }

    //   const result = await response.json();
    //   console.log("Competition created:", result);
    //   alert("Competition created successfully! 🎉");
      
    //   // Reset form
    //   setFormData({
    //     name: "",
    //     expiryDate: getDefaultExpiryDate(),
    //     gameCode: "",
    //   });


    //   alert("Created successsfuly")
    // } catch (error) {
    //   console.error('Error creating competition:', error);
    //   alert(error instanceof Error ? error.message : 'Failed to create competition');
    // }

      // /api/competitions/create
        console.log(new Date())
        const data = {
          name: formData.name,
          expiry: new Date("2025-03-14").toISOString().slice(0, 19).replace('T', ' '),
          game_code: formData.gameCode
      };
      
      
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/competition/create`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => {      
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          return response.json();
      })
      .then(result => {
          console.log('Response:', result);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto text-black">
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
              value={formData.expiryDate.toISOString().slice(0, 19).replace('T', ' ')}
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
          <button onClick={async ()=> {
            // /api/competitions/create
              console.log("HELLO")
              const data = {
                name: "TEST TSET",
                expiry: new Date("2025-03-14").toISOString().slice(0, 19).replace('T', ' '),
                game_code: 3
            };
            
            console.log("B");
            
            fetch("http://3.10.53.122:5340/api/competitions/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log("C");
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                return response.json();
            })
            .then(result => {
                console.log('Response:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
          }
          }>
          </button>
      </section>
    </main>
  );
}
