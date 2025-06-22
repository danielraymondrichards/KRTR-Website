import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient();

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
    },
  });

  const clerkUser = await res.json();
  const { id, first_name, last_name, email_addresses } = clerkUser;

  const payload: Database['public']['Tables']['users']['Insert'] = {
  clerk_id: id,
  first_name,
  last_name,
  email,
  role: 'viewer',       // 👈 required by your Insert type
  is_admin: false       // 👈 also required unless your DB sets a default
};

const { error } = await supabase
  .from('users')
  .upsert(payload, { onConflict: 'clerk_id' });

  if (error) {
    console.error('Supabase sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'success' });
}
