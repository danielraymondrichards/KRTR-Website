'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleVideoUpload = async (): Promise<string | null> => {
    if (!videoFile) return null;
    const res = await fetch('/api/mux/createUpload', {
      method: 'POST',
    });
    const { url, uploadId } = await res.json();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };
      xhr.onload = () => resolve(uploadId);
      xhr.onerror = reject;
      xhr.send(videoFile);
    });
  };

  const handleCreate = async () => {
    setUploading(true);

    const today = new Date();
    const datePrefix = today.toISOString().split('T')[0].replace(/-/g, '');
    const { data: existing } = await supabase.from('stories').select('id').like('id', `${datePrefix}%`);
    const sequence = (existing?.length || 0) + 1;
    const id = `${datePrefix}${String(sequence).padStart(3, '0')}`;

    const muxUploadId = await handleVideoUpload();

    await supabase.from('stories').insert([{ id, title, author, mux_upload_id: muxUploadId }]);
    router.push('/stories');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">New Story</h1>
      <input className="block border p-2 mb-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="block border p-2 mb-2 w-full" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input
        type="file"
        accept="video/*"
        className="block mb-2"
        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        ref={inputRef}
      />
      {uploading && (
        <div className="mb-2">
          <div className="bg-gray-200 h-4 rounded">
            <div className="bg-blue-600 h-4 rounded" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="text-sm mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCreate} disabled={uploading}>
        Create Story
      </button>
    </div>
  );
}
