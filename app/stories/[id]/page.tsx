import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ✅ Use regular async function, NOT arrow function
export async function generateMetadata(
  context: { params: { id: string } }
): Promise<Metadata> {
  const { params } = context;

  const { data: story } = await supabase
    .from('stories')
    .select('title')
    .eq('id', params.id)
    .single();

  return {
    title: story?.title ? `KRTR Local – ${story.title}` : 'KRTR Local',
  };
}

// ✅ Also use plain inline typing for page props
export default async function StoryPage({ params }: { params: { id: string } }) {
  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !story) return notFound();

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
      <p className="text-sm text-gray-500 mb-4">By {story.author}</p>

      {story.mux_playback_id && (
        <div className="aspect-video mb-4">
          <iframe
            src={`https://stream.mux.com/${story.mux_playback_id}.m3u8`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full rounded"
          />
        </div>
      )}

      <div className="prose max-w-none">{story.text}</div>
    </article>
  );
}
