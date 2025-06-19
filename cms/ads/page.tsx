// cms/ads/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/pages/api/lib/supabaseClient';
import { useIsAdmin } from '@/lib/useIsAdmin';

export default function AdsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { isAdmin, checking } = useIsAdmin();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !checking) {
      if (!user || !isAdmin) {
        router.push('/cms');
      } else {
        setLoading(false);
      }
    }
  }, [user, isLoaded, isAdmin, checking, router]);

  if (!isLoaded || checking || loading) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="cms-title">Ad Management</h1>

      <div className="my-6">
        <h2 className="text-lg font-semibold mb-2">Homepage Banner Ads</h2>
        <p className="text-sm text-gray-600">Coming soon: Upload and rotate top strip, hero strip, and sponsor ads.</p>
      </div>
    </div>
  );
}
