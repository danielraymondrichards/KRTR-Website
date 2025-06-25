// components/RotatingBanner.tsx
'use client';

import { useEffect, useState } from 'react';

type Ad = {
  id: string;
  image_url: string;
  target_url: string;
};

export default function RotatingBanner({ ads }: { ads: Ad[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 8000); // rotate every 8 seconds
    return () => clearInterval(interval);
  }, [ads.length]);

  const ad = ads[index];

  return (
    <div className="w-full">
      <a href={ad.target_url} target="_blank" rel="noopener noreferrer">
        <img src={ad.image_url} alt="Banner Ad" className="w-full h-auto block" />
      </a>
    </div>
  );
}
