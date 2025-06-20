'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditStory() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [form, setForm] = useState({
    author: '',
    title: '',
    tease: '',
    text: '',
    headerImage: '',
    videoUrl: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading story:', error);
      } else if (data) {
        setForm({
          author: data.author || '',
          title: data.title || '',
          tease: data.tease || '',
          text: data.text || '',
          headerImage: data.headerImage || '',
          videoUrl: data.videoUrl || '',
        });
      }

      setLoading(false);
    };

    loadStory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('stories')
      .update(form)
      .eq('id', id);

    if (error) {
      console.error('Error updating story:', error);
    } else {
      router.push('/cms/stories');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="tease"
        value={form.tease}
        onChange={handleChange}
        placeholder="Tease"
        className="w-full border p-2"
      />
      <textarea
        name="text"
        value={form.text}
        onChange={handleChange}
        placeholder="Main text"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="headerImage"
        value={form.headerImage}
        onChange={handleChange}
        placeholder="Header image URL"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="videoUrl"
        value={form.videoUrl}
        onChange={handleChange}
        placeholder="Mux video URL"
        className="w-full border p-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Update Story
      </button>
    </form>
  );
}
