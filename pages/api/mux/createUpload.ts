import type { NextApiRequest, NextApiResponse } from 'next';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: 'public',
      },
      playback_policy: 'public',
    });

    res.status(200).json({ upload });
  } catch (error) {
    console.error('Mux upload error:', error);
    res.status(500).json({ error: 'Mux upload creation failed' });
  }
}