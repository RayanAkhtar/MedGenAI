import Navbar from "@/app/components/Navbar";
import AdminStats from "../components/AdminStats";

export default function Admin() {
  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <section className="grid grid-cols-2 gap-8 p-8 bg-white">
        <AdminStats title="Total Engagement" />
        <AdminStats title="User Accuracy" />
      </section>

      <section className="p-8 bg-white">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3 flex flex-col gap-8">
            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">Real Images</h2>
              <p>Total images: 582</p>
              <p>Interpretation: 82%</p>
              <div className="flex gap-4 mt-6">
                <button className="px-8 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="px-8 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-2xl text-black">
              <h2 className="text-xl font-bold mb-4">AI Images</h2>
              <p>Total images: 792</p>
              <p>Interpretation: 50%</p>
              <div className="flex gap-4 mt-6">
                <button className="px-8 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  View Feedback
                </button>
                <button className="px-8 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105">
                  Upload New Images
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl w-64 text-black ml-auto">
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
