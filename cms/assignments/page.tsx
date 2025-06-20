// cms/assignments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useIsAdmin } from '@/lib/useIsAdmin';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';

export default function StoryAssignment() {
  const { isAdmin, checking } = useIsAdmin();


  const [heroId, setHeroId] = useState('');
  const [topIds, setTopIds] = useState(['', '', '', '']);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin === true) {
      const loadAssignment = async () => {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .limit(1)
          .single();

        if (data) {
          setRowId(data.id);
          setHeroId(data.hero_story_id || '');
          setTopIds(data.top_story_ids || ['', '', '', '']);
        }

        if (error && error.code !== 'PGRST116') {
          console.error('Failed to load assignments:', error);
        }
      };

      loadAssignment();
    }
  }, [isAdmin]);

  const handleUpdate = async () => {
    const payload = {
      hero_story_id: heroId,
      top_story_ids: topIds,
      updated_at: new Date().toISOString(),
    };

    const { error } = rowId
      ? await supabase.from('assignments').update(payload).eq('id', rowId)
      : await supabase.from('assignments').insert([payload]);

    if (error) {
      alert('Failed to save assignments');
      console.error(error);
    } else {
      alert('Assignments updated');
    }
  };

  const updateTopStory = (i: number, value: string) => {
    const updated = [...topIds];
    updated[i] = value;
    setTopIds(updated);
  };

  if (isAdmin === null) return <p>Checking access…</p>;
  if (!isAdmin) return <p className="text-red-600">Access denied: Admins only.</p>;

  return (
    <SignedIn>
      <div>
        <h1 className="cms-title">Story Assignment</h1>

        <div className="my-6">
          <label className="block font-semibold mb-1">Hero Story ID</label>
          <input
            className="w-full p-2 border rounded"
            value={heroId}
            onChange={(e) => setHeroId(e.target.value)}
          />
        </div>

        <div className="my-6">
          <label className="block font-semibold mb-2">Top Stories (1–4) IDs</label>
          {topIds.map((id, i) => (
            <div key={i} className="mb-2">
              <label className="block text-sm mb-1">Top Story {i + 1}</label>
              <input
                className="w-full p-2 border rounded"
                value={id}
                onChange={(e) => updateTopStory(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleUpdate}>
          Save Assignments
        </button>
      </div>
    </SignedIn>
  );
}
