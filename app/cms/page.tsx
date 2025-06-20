'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SignIn } from '@clerk/nextjs';

export default function CmsDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [totalStories, setTotalStories] = useState<number>(0);
  const [slots, setSlots] = useState<{ label: string; title: string; created_at: string }[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      // Get story count
      const { count } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });
      setTotalStories(count || 0);

      // Get the latest assignment
      const { data: assignment } = await supabase
        .from('assignments')
        .select('hero_story_id, top_story_1, top_story_2, top_story_3, top_story_4')
        .single();

      if (!assignment) return;

      // Create list of slots and fetch each story
      const slotMap = [
        { key: 'hero_story_id', label: 'HERO' },
        { key: 'top_story_1', label: 'TOP 1' },
        { key: 'top_story_2', label: 'TOP 2' },
        { key: 'top_story_3', label: 'TOP 3' },
        { key: 'top_story_4', label: 'TOP 4' }
      ];

      const ids = slotMap.map(slot => assignment[slot.key]).filter(Boolean);
      const { data: stories } = await supabase
        .from('stories')
        .select('id, title, created_at')
        .in('id', ids);

      const slotsData = slotMap.map(slot => {
        const match = stories?.find(s => s.id === assignment[slot.key]);
        return {
          label: slot.label,
          title: match?.title || '—',
          created_at: match?.created_at
            ? new Date(match.created_at).toLocaleDateString()
            : '—'
        };
      });

      setSlots(slotsData);
    }

    fetchData();
  }, []);

  if (!isLoaded) return <div className="p-6 text-lg">Loading...</div>;
  

if (!isSignedIn) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow">
        <SignIn />
      </div>
    </div>
  );
}


  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-xl font-bold">KRTR CMS</div>
        <ul className="flex gap-4 text-sm font-medium">
          <li><Link href="/cms">Dashboard</Link></li>
          <li><Link href="/cms/stories">Stories</Link></li>
          <li><Link href="/cms/ads">Ads</Link></li>
          <li><Link href="/cms/calendar">Calendar</Link></li>
          <li><Link href="/cms/livestream">Livestream</Link></li>
          <li><Link href="/cms/users">Users</Link></li>
        </ul>
        <div className="flex items-center gap-3 text-sm">
          <span>Welcome, {user.firstName}</span>
          <SignOutButton />
        </div>
      </nav>

      <section className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-2">Total Stories</h2>
            <p className="text-4xl font-bold text-blue-600">{totalStories}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-2">Hero + Top 4 Stories</h2>
            <ul className="space-y-2">
              {slots.map(({ label, title, created_at }, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{label}: {title}</span>
                  <span className="text-gray-500">{created_at}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
