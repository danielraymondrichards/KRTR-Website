import '../../styles/globals.css';

export const metadata = {
  title: 'KRTR Local',
  description: 'Local news and stories from your community.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}