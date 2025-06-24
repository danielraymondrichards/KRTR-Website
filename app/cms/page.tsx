// app/cms/page.tsx
'use client';

import Link from 'next/link';

export default function CmsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">KRTR CMS Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/cms/stories" className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700">
          📖 Manage Stories
        </Link>
        <Link href="/cms/ads" className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700">
          📢 Manage Ads
        </Link>
        <Link href="/cms/assignments" className="bg-purple-600 text-white p-4 rounded shadow hover:bg-purple-700">
          📰 Homepage Assignments
        </Link>
      </div>
    </div>
  );
}
