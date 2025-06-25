import { supabase } from '@/lib/supabaseClient';

export async function fetchAllsiteAd() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('type', 'allsite')
    .lte('start_date', today)
    .gte('end_date', today)
    .single();

  if (error || !data) return null;
  return data;
}
