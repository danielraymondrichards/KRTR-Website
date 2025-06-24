'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewStoryPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const { error } = await supabase.from('stories').insert([{ title, author }]);
    if (!error) router.push('/stories');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">New Story</h1>
      <input className="block border p-2 mb-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="block border p-2 mb-2 w-full" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}
