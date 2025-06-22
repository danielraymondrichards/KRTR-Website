import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  // Fetch Clerk user info using backend key
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch Clerk user' }, { status: 500 });
  }

  const clerkUser = await res.json();
  const { id, first_name, last_name, email_addresses } = clerkUser;
  const email = email_addresses?.[0]?.email_address || '';

  const payload: Database['public']['Tables']['users']['Insert'] = {
    clerk_id: id,
    first_name,
    last_name,
    email,
    role: 'viewer',       // default role
    is_admin: false       // default to non-admin
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
