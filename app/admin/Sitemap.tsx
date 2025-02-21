'use client';

import Link from "next/link";

export default function Sitemap() {
  return (
    <div className="bg-white p-6 shadow-md rounded-2xl w-full lg:w-1/4 text-black text-center">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Sitemap</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/admin" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Admin Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}
