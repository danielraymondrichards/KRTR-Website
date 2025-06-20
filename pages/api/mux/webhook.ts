import type { NextApiRequest, NextApiResponse } from 'next';
import Webhooks from '@mux/mux-node';
import { supabase } from '../../../lib/supabaseClient';

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const readRawBody = async (readable: any): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const rawBody = await readRawBody(req);
  const sig = req.headers['mux-signature'] as string;

  const webhooks = new Webhooks({ secret: muxWebhookSecret });

  let event;
  try {
    event = webhooks.constructEvent(rawBody.toString(), sig);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'video.asset.ready') {
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
