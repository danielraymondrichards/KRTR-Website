'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('ads').select('*').then(({ data }) => {
      if (data) setAds(data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ad Management</h1>
      <ul className="divide-y">
        {ads.map((ad) => (
          <li key={ad.id} className="p-2">{ad.name}</li>
        ))}
      </ul>
    </div>
  );
}