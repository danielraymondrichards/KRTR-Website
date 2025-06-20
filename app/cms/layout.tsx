'use client';
import { ClerkProvider, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useEffect } from 'react';
import { syncUser } from '@/lib/syncUserToSupabase';
import '../../cms.css';



export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    if (user?.id && user?.primaryEmailAddress?.emailAddress) {
      syncUser(user.id, user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

