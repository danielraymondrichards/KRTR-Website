// pages/api/mux/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Mux from '@mux/mux-node';
import { supabase } from '../../../lib/supabaseClient';

export const config = { api: { bodyParser: false } };

const mux = new Mux({ webhookSecret: process.env.MUX_WEBHOOK_SECRET });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawBody = await buffer(req); // get raw bytes
  const bodyStr = rawBody.toString();
  
  try {
    // throws if invalid
    mux.webhooks.verifySignature(bodyStr, req.headers, process.env.MUX_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Invalid webhook signature:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(bodyStr);
  if (event.type === 'video.asset.ready') {
    const playbackId = event.data.playback_ids?.[0]?.id;
    const assetId = event.data.id;
    if (playbackId) {
      await supabase
        .from('stories')
        .update({ mux_playback_id: playbackId })
        .eq('mux_asset_id', assetId);
    }
  }

  res.status(200).json({ received: true });
}

async function buffer(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}
