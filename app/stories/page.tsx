import { supabase } from '@/lib/supabaseClient';

export default async function StoriesPage() {
  const { data: stories, error } = await supabase
    .from('stories')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) return <div>Error loading stories</div>;

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold">Stories</h1>
      {stories?.map((story) => (
        <article key={story.id} className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-2">{story.title}</h2>
          <p className="text-sm text-gray-500 mb-4">By {story.author}</p>
          {story.mux_playback_id && (
            <div className="mb-4 aspect-video">
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
      ))}
    </div>
  );
}
