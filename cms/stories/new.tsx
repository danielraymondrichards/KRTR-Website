'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewStory() {
  const router = useRouter();

  const [form, setForm] = useState({
    author: '',
    title: '',
    tease: '',
    text: '',
    image_url: '',
    video_url: '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videoFile) {
      setUploading(true);
      const res = await fetch('/api/mux/createUpload', { method: 'POST' });
      const { uploadUrl } = await res.json();

      const upload = await fetch(uploadUrl, {
        method: 'PUT',
        body: videoFile,
        headers: { 'Content-Type': videoFile.type },
      });

      if (!upload.ok) {
        alert('Failed to upload video.');
        setUploading(false);
        return;
      }

      form.video_url = uploadUrl.split('/').pop(); // asset ID used as temp key
      setUploading(false);
    }

    const { error } = await supabase.from('stories').insert([form]);

    if (error) {
      alert('Failed to save story.');
      console.error(error);
    } else {
      router.push('/cms/stories');
    }
  };

  return (
    <div>
      <h1 className="cms-title">Add New Story</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {['author', 'title', 'tease', 'image_url'].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize mb-1">{field.replace('_', ' ')}:</label>
            <input
              className="w-full p-2 border rounded"
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required
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

        <div>
          <label className="block font-semibold mb-1">Upload Video (optional):</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setVideoFile(file);
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Save Story'}
        </button>
      </form>
    </div>
  );
}
