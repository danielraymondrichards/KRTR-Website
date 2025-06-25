import NavMenu from '@/components/NavMenu';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MuxPlayer } from '@mux/mux-player-react';

type Story = {
  id: string;
  title: string;
  tease: string;
  text: string;
  pub_date: string;
  mux_playback_id: string;
};

export default async function StoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: story, error } = await supabase
    .from('stories')
    .select('id, title, tease, text, pub_date, mux_playback_id')
    .eq('id', params.id)
    .single();

  if (error || !story) {
    console.error(error);
    return notFound();
  }

  return (
    <div>
      {/* Header / Navbar */}
      <header className="w-full py-4 border-b bg-[#226CE0] text-white">
        <div className="flex justify-between items-center px-4 md:px-[100px]">
          <div className="text-2xl font-bold">
            <Link href="/">[Logo]</Link>
          </div>
          <nav>
            <NavMenu />
          </nav>
        </div>
      </header>

      {/* HS Banner Ad */}
      <section className="bg-yellow-300 px-4 md:px-[100px] py-2 text-center font-semibold text-lg">
        HS Banner Ad
      </section>

      {/* Main Layout */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-[100px] py-6 auto-rows-min">

        {/* Story Content */}
        <article className="md:col-span-2 bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{new Date(story.pub_date).toLocaleDateString()}</p>
          <p className="text-lg text-gray-700 mb-6">{story.tease}</p>

          {/* Mux Video Player */}
          {story.mux_playback_id && (
            <div className="mb-6">
              <MuxPlayer
                playbackId={story.mux_playback_id}
                streamType="on-demand"
                metadata={{ video_title: story.title }}
                primaryColor="#226CE0"
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: '0.5rem' }}
              />
            </div>
          )}

          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
            {story.text}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="bg-gray-100 p-4 rounded shadow" id="story-sidebar">
          Story Sidebar
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black text-white text-center py-4">
        [Footer Placeholder]
      </footer>
    </div>
  );
}
