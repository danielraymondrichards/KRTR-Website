import type { NextApiRequest, NextApiResponse } from 'next';
import Mux from '@mux/mux-node';
import { supabase } from '../../../lib/supabaseClient';

const mux = new Mux(); // No API keys needed for webhook validation
const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const readRawBody = async (readable: ReadableStream | null): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  if (!readable) return Buffer.from([]);
  for await (const chunk of readable as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const rawBody = await readRawBody(req.body as any);
  const sig = req.headers['mux-signature'] as string;

  let event;
  try {
    event = mux.webhooks.verifyHeader(rawBody.toString(), sig, muxWebhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event?.type === 'video.asset.ready') {
    const playbackId = event.data.playback_ids?.[0]?.id;
    const assetId = event.data.id;

    if (playbackId && assetId) {
      await supabase
        .from('stories')
        .update({ mux_playback_id: playbackId })
        .eq('mux_asset_id', assetId);
    }
  }

  return res.status(200).json({ received: true });
}
