import type { NextApiRequest, NextApiResponse } from 'next';
import Webhooks from '@mux/mux-node';
import { supabase } from '../../../lib/supabaseClient';

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const readRawBody = async (req: NextApiRequest): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  const readable = req.body as unknown as ReadableStream<Uint8Array> | null;
  if (!readable) return Buffer.from([]);

  for await (const chunk of readable as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['mux-signature'] as string;
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = Webhooks.verifyHeader(rawBody.toString(), sig, muxWebhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'video.asset.ready') {
    const { id: assetId, playback_ids, passthrough } = event.data;

    if (passthrough) {
      await supabase
        .from('stories')
        .update({ muxPlaybackId: playback_ids?.[0]?.id })
        .eq('id', passthrough);
    }
  }

  return res.status(200).json({ received: true });
}
