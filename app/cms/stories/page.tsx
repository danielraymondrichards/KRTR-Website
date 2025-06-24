'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Story = {
  id: string;
  title: string;
  author: string;
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    supabase.from('stories').select('id, title, author').then(({ data }) => {
      if (data) setStories(data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stories</h1>
      <Link href="/stories/new" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block">
        + Add New Story
      </Link>
      <ul className="divide-y">
        {stories.map((s) => (
          <li key={s.id} className="p-2">
            <Link href={`/stories/edit/${s.id}`} className="text-blue-600 hover:underline">
              {s.title} — {s.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
