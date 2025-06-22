import '../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KRTR Local',
  description: 'Local news and stories from your community.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
