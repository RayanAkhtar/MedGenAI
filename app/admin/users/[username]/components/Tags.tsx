'use client';

import React from 'react';

export function Tags() {
  return (
    <div className="p-6 border rounded-lg shadow-md col-span-1 text-center">
      <h2 className="text-xl font-semibold">Tags</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-1 flex items-center justify-center">
        <p className="p-2 border rounded-lg shadow-md text-xl hover:scale-95 transition-transform duration-300">
          Neuro ninja
        </p>
        <p className="p-2 border rounded-lg shadow-md text-xl hover:scale-95 transition-transform duration-300">
          X-ray visionary
        </p>
        <p className="p-2 border rounded-lg shadow-md text-xl hover:scale-95 transition-transform duration-300">
          AI Antagonist
        </p>
        <p className="p-2 border rounded-lg shadow-md text-xl hover:scale-95 transition-transform duration-300">
          Diagnosis Master
        </p>
      </div>
    </div>
  );
}
