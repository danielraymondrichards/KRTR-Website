// cms/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { syncUser } from '@/lib/syncUserToSupabase';
import './cms.css';

export const metadata = {
  title: 'KRTR CMS',
  description: 'Content Management System for KRTR Local',
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  syncUser(); // Sync Clerk user to Supabase
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
