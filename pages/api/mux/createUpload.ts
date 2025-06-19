import { NextApiRequest, NextApiResponse } from 'next';
import { Video } from '@mux/mux-node';

const mux = new Video({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const upload = await mux.uploads.create({
      new_asset_settings: { playback_policy: 'public' },
      cors_origin: '*',
    });

    res.status(200).json({ uploadUrl: upload.url });
  } catch (err) {
    console.error('Mux upload error:', err);
    res.status(500).json({ error: 'Failed to create upload URL' });
  }
}
