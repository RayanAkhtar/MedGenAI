'use client'
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const params = useParams(); // Get the user_id from the URL
  const userId = params?.user_id;

  return (
    <div>
      <Navbar/>
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p>User ID: {userId}</p>
      </div>
    </div>

  );
}
