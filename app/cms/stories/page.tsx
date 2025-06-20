'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Story = {
  id: string;
  title: string;
  author: string;
};

export default function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, author')
        .order('created_at', { ascending: false });

      if (!error && data) setStories(data);
    };

    loadStories();
  }, []);

  return (
    <div>
      <h1 className="cms-title">Story Builder</h1>

      <div className="my-4">
        <Link href="/cms/stories/new" className="bg-green-600 text-white px-4 py-2 rounded">
          + Add New Story
        </Link>
      </div>

      <ul className="divide-y border rounded">
        {stories.map((story) => (
          <li key={story.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{story.title}</div>
              <div className="text-sm text-gray-600">By {story.author}</div>
            </div>
            <Link href={`/cms/stories/${story.id}/edit`} className="text-blue-600 hover:underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
