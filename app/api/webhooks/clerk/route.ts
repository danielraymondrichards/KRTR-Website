import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient();

  // Get Clerk user info
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
    },
  });

  const clerkUser = await res.json();

  const { id, first_name, last_name, email_addresses } = clerkUser;

  const { error } = await supabase.from('users').upsert({
    clerk_id: id,
    first_name,
    last_name,
    email: email_addresses?.[0]?.email_address || '',
  }, { onConflict: 'clerk_id' });

  if (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
