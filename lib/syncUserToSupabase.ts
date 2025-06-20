import { supabase } from './supabaseClient';

export async function syncUser(clerkUserId: string, email: string) {
  const { error } = await supabase
    .from('users')
    .upsert([{ id: clerkUserId, email }], { onConflict: 'id' });

  if (error) console.error('Error syncing user to Supabase:', error);
}
