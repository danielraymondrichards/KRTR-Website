// cms/layout.tsx
import '../styles/cms.css';
import { ClerkProvider } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { syncUser } from '@/lib/syncUserToSupabase';

export const metadata = {
  title: 'KRTR CMS',
  description: 'Content Management System for KRTR Local',
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cms-layout">
        <aside className="cms-sidebar">
          <div className="cms-logo">KRTR CMS</div>
          <nav className="cms-nav">
            <a href="/cms">Dashboard</a>
            <a href="/cms/ads">Ad Management</a>
            <a href="/cms/assignments">Story Assignment</a>
            <a href="/cms/stories">Story Builder</a>
            <a href="/cms/admin">Admin Panel</a>
          </nav>
        </aside>
        <main className="cms-main">{children}</main>
      </body>
    </html>
  );
}

export const metadata = { title: 'KRTR CMS', description: '...' };

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="cms-layout">{children}</body>
      </html>
    </ClerkProvider>
  );
}


export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      syncUser(user.id, user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user]);

  return (
    // ... ClerkProvider, SignedIn, etc.
  );
}