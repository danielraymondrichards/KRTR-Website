'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditStoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      supabase.from('stories').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setAuthor(data.author);
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    await supabase.from('stories').update({ title, author }).eq('id', id);
    router.push('/stories');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Story</h1>
      <input className="block border p-2 mb-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="block border p-2 mb-2 w-full" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
    </div>
  );
}
