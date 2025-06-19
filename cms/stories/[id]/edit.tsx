'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditStory() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    author: '',
    title: '',
    tease: '',
    text: '',
    image_url: '',
    video_url: '',
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
        setForm(data);
      }

      setLoading(false);
    };

    if (id) loadStory();
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
      alert('Failed to update story.');
      console.error(error);
    } else {
      router.push('/cms/stories');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="cms-title">Edit Story</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {['author', 'title', 'tease', 'image_url', 'video_url'].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize mb-1">{field.replace('_', ' ')}:</label>
            <input
              className="w-full p-2 border rounded"
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required={field !== 'video_url'}
            />
          </div>
        ))}
        <div>
          <label className="block font-semibold mb-1">Story Text:</label>
          <textarea
            className="w-full p-2 border rounded min-h-[120px]"
            name="text"
            value={form.text}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
