import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

type ClerkUser = {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: { email_address: string }[];
};

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch Clerk user' }, { status: 500 });
  }

  const clerkUser = (await res.json()) as ClerkUser;

  const insertUser: Database['public']['Tables']['users']['Insert'] = {
    clerk_id: clerkUser.id,
    first_name: clerkUser.first_name,
    last_name: clerkUser.last_name,
    email: clerkUser.email_addresses?.[0]?.email_address || null,
    role: 'viewer',
    is_admin: false,
  };

  const { error } = await supabase
    .from('users')
    .upsert(insertUser, { onConflict: 'clerk_id' });

  if (error) {
    console.error('Supabase sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'success' });
}
