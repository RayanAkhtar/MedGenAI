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
        <li>
          <Link href="/admin/user-page" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Users
          </Link>
        </li>
        <li>
          <Link href="/admin/competitions" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Create Competition
          </Link>
        </li>
        <li>
          <Link href="/admin/generate-ai-image" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Generate Counterfactual Image
          </Link>
        </li>
        <li>
          <Link href="/admin/manage-tags" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Manage User Tags
          </Link>
        </li>
        <li>
          <Link href="/admin/create-dual-game" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Create Dual Game
          </Link>
        </li>
        <li>
          <Link href="/admin/create-single-game" className="block px-4 py-2 bg-[var(--heartflow-red)] text-white rounded-lg hover:bg-[var(--heartflow-blue)] transition-colors duration-300">
            Create Single Game
          </Link>
        </li>
      </ul>
    </div>
  );
}
