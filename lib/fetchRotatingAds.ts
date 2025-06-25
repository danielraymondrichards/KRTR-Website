// lib/fetchRotatingAds.ts
import { supabase } from '@/lib/supabaseClient';

export async function fetchRotatingAds(type: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('type', type)
    .lte('start_date', today)
    .gte('end_date', today);

  if (error || !data) return [];
  return data;
}
