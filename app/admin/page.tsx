import Navbar from "@/app/components/Navbar";
import AdminStats from "../components/AdminStats";

export default function Admin() {
  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      {/* Responsive Stats Section */}
      <section className="flex flex-wrap gap-8 p-8 bg-white justify-center">
        <div className="w-full md:w-[48%]">
          <AdminStats title="Total Engagement" />
        </div>
        <div className="w-full md:w-[48%]">
          <AdminStats title="User Accuracy" />
        </div>
      </section>

      {/* Image Data & Sitemap Section */}
      <section className="p-8 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Real and AI Images Section */}
          <div className="flex flex-col gap-8 w-full lg:w-3/4">
            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">Real Images</h2>
              <p>Total images: 582</p>
              <p>Interpretation: 82%</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">AI Images</h2>
              <p>Total images: 792</p>
              <p>Interpretation: 50%</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>
          </div>

          {/* Sitemap Section */}
          <div className="bg-white p-6 shadow-md rounded-2xl w-full lg:w-1/4 text-black lg:ml-auto text-center">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sitemap</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Reports
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
