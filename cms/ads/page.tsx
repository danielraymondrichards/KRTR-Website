'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/pages/api/lib/supabaseClient';

export default function AdManagement() {
  const [hsAd, setHsAd] = useState('');
  const [tsAd, setTsAd] = useState('');
  const [spAds, setSpAds] = useState<string[]>([]);
  const [newSpAd, setNewSpAd] = useState('');

  useEffect(() => {
    const loadAds = async () => {
      const { data, error } = await supabase.from('ads').select('*');
      if (error) return console.error(error);

      setHsAd(data.find((ad) => ad.type === 'HS')?.url || '');
      setTsAd(data.find((ad) => ad.type === 'TS')?.url || '');
      setSpAds(data.filter((ad) => ad.type === 'SP').map((ad) => ad.url));
    };

    loadAds();
  }, []);

  const saveSingleAd = async (type: string, url: string) => {
    const { error } = await supabase
      .from('ads')
      .upsert({ type, url }, { onConflict: 'type' });

    if (error) alert(`Error saving ${type} ad: ${error.message}`);
  };

  const handleSaveAll = async () => {
    await saveSingleAd('HS', hsAd);
    await saveSingleAd('TS', tsAd);

    // Delete all existing SP ads
    await supabase.from('ads').delete().eq('type', 'SP');

    // Insert new SP ads
    const spInsert = spAds.map((url) => ({ type: 'SP', url }));
    const { error } = await supabase.from('ads').insert(spInsert);
    if (error) alert(`Error saving SP ads: ${error.message}`);
  };

  const removeSpAd = (index: number) =>
    setSpAds(spAds.filter((_, i) => i !== index));

  return (
    <div>
      <h1 className="cms-title">Ad Management</h1>

      <div className="my-6">
        <label className="block font-semibold mb-1">HS Banner Ad URL</label>
        <input
          className="w-full p-2 border rounded"
          value={hsAd}
          onChange={(e) => setHsAd(e.target.value)}
        />
      </div>

      <div className="my-6">
        <label className="block font-semibold mb-1">TS Banner Ad URL</label>
        <input
          className="w-full p-2 border rounded"
          value={tsAd}
          onChange={(e) => setTsAd(e.target.value)}
        />
      </div>

      <div className="my-6">
        <label className="block font-semibold mb-2">SP Rotating A
