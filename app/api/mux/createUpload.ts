// ✅ app/api/mux/createUpload.ts
import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: NextRequest) {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ['public'],
    },
  });

  return NextResponse.json({
    url: upload.url,
    uploadId: upload.id,
  });
}
