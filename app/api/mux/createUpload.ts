import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const upload = await mux.video.uploads.create({
    new_asset_settings: { playback_policy: '[public]' },
    playback_policy: '[public]',
  });

  res.status(200).json({
    url: upload.url,
    uploadId: upload.id,
  });
}
