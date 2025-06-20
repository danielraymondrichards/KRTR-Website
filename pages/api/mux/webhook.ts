// pages/api/mux/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Mux from '@mux/mux-node';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const mux = new Mux();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['mux-signature'] as string;
  const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;
  const rawBody = (await buffer(req)).toString();

  let event;
  try {
    event = mux.webhooks.verifyHeader(rawBody, sig, muxWebhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'video.asset.ready') {
    const playbackId = event.data.playback_ids?.[0]?.id;
    const uploadId = event.data.upload_id;

    if (playbackId && uploadId) {
      await supabase
        .from('stories')
        .update({ muxPlaybackId: playbackId })
        .eq('muxUploadId', uploadId);
    }
  }

  return res.status(200).json({ received: true });
}
