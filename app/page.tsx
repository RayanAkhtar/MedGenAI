import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Footer from "@/app/components/Footer";
export default function Home() {
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
