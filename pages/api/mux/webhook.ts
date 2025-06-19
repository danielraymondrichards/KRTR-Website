import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook, Video } from '@mux/mux-node';
import { supabase } from '@/lib/supabaseClient';

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

const mux = new Video({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const config = {
  api: {
    bodyParser: false, // Required for raw signature verification
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['mux-signature'] as string;

  let event;
  try {
    event = Webhook.verify(rawBody.toString(), sig, muxWebhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).end();
  }

  if (event.type === 'video.asset.ready') {
    const assetId = event.data.id;
    const playbackId = event.data.playback_ids?.[0]?.id;

    if (!playbackId) return res.status(400).end();

    // Update story where video_url was temporarily set to asset id or url
    const { error } = await supabase
      .from('stories')
      .update({ video_url: `https://stream.mux.com/${playbackId}.m3u8` })
      .eq('video_url', assetId);

    if (error) {
      console.error('Failed to update story with playback ID:', error);
      return res.status(500).end();
    }
  }

  return res.status(200).end();
}

// Helper to get raw body
async function getRawBody(req: NextApiRequest) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}
