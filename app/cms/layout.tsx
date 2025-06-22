'use client';
import '../../styles/cms.css';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
