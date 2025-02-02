'use client'
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
        router.push('/dashboard')
    }
}, [user, router])
  return (
    <main className="h-screen overflow-y-auto">
      <section className = "h-screen">
        <Navbar />
        <Hero />
      </section>
      <Footer />
    </main>
  );
}
  