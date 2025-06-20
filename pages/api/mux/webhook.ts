import type { NextApiRequest, NextApiResponse } from 'next';
import Webhook from '@mux/mux-node';
import { supabase } from '../../../lib/supabaseClient';

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (readable: ReadableStream<Uint8Array> | null) => {
  const chunks: Uint8Array[] = [];
  if (!readable) return Buffer.from([]);
  const reader = (readable as any)[Symbol.asyncIterator]();
  for await (const chunk of reader) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await buffer(req.body);
  const sig = req.headers['mux-signature'] as string;

  let event;
  try {
    event = Webhook.verifyHeader(rawBody.toString(), sig, muxWebhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'video.asset.ready') {
    const assetId = event.data.id;
    const playbackId = event.data.playback_ids?.[0]?.id;

    if (assetId && playbackId) {
      const { error } = await supabase
        .from('stories')
        .update({ muxPlaybackId: playbackId })
        .eq('muxAssetId', assetId);

      if (error) {
        console.error('Failed to update story with playback ID:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`Updated story with assetId ${assetId} → playbackId ${playbackId}`);
    }
  }

  res.status(200).json({ received: true });
}
