'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewStoryPage() {
  const { user, isSignedIn } = useUser();
  const supabase = createClient();
  const router = useRouter();

  const [storyId, setStoryId] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [tease, setTease] = useState('');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate story ID and fetch author name
  useEffect(() => {
    const init = async () => {
      if (!isSignedIn || !user) return;

      // Fetch name from Supabase `users` table
      const { data: userData } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('clerk_id', user.id)
        .single();

      if (userData) {
        setAuthor(`${userData.first_name} ${userData.last_name}`);
      }

      // Generate next ID: yyyymmdd###
      const today = new Date();
      const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');

      const { data: existing } = await supabase
        .from('stories')
        .select('id')
        .like('id', `${yyyymmdd}%`);

      const count = (existing?.length || 0) + 1;
      const newId = `${yyyymmdd}${String(count).padStart(3, '0')}`;
      setStoryId(newId);
    };

    init();
  }, [isSignedIn, user, supabase]);

  // Upload to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url as string;
  };

  // Upload to Mux
  const uploadVideoToMux = async () => {
    if (!videoFile) return null;

    const res = await fetch('/api/mux/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName: videoFile.name }),
      headers: { 'Content-Type': 'application/json' },
    });

    const { uploadUrl, assetId } = await res.json();

    // Upload video directly to Mux URL
    await fetch(uploadUrl, {
      method: 'PUT',
      body: videoFile,
      headers: { 'Content-Type': 'video/mp4' },
    });

    // Poll for playback ID from backend
    return new Promise<string>((resolve) => {
      const interval = setInterval(async () => {
        const { data } = await supabase
          .from('stories')
          .select('mux_playback_id')
          .eq('id', storyId)
          .single();

        if (data?.mux_playback_id) {
          clearInterval(interval);
          resolve(data.mux_playback_id);
        }
      }, 2000);
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const imageUrl = await uploadImageToCloudinary();
  const muxPlaybackId = await uploadVideoToMux();

  const { error, status } = await supabase.from('stories').insert({
    id: storyId,
    author,
    title,
    tease,
    text,
    image_url: imageUrl || '',
    mux_playback_id: muxPlaybackId || '',
  });

  if (error) {
    console.error('Supabase insert error:', error.message);
  } else {
    console.log('Story inserted successfully!', status);
    router.push('/cms/stories');
  }

  setLoading(false);
};


  

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">New Story</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500">Story ID: {storyId}</p>
        <p className="text-sm text-gray-500">Author: {author}</p>

        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Tease"
          value={tease}
          onChange={(e) => setTease(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border rounded min-h-[200px]"
          placeholder="Story text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Create Story'}
        </button>
      </form>
    </main>
  );
}
