import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import NavMenu from '@/components/NavMenu';

type Story = {
  id: string;
  title: string;
  tease: string;
  mux_thumbnail_url: string;
};

export default async function HomePage() {
  const { data: assignment } = await supabase
    .from('assignments')
    .select('hero_story_id, top_story_1, top_story_2, top_story_3, top_story_4')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const assignedIds = [
    assignment?.hero_story_id,
    assignment?.top_story_1,
    assignment?.top_story_2,
    assignment?.top_story_3,
    assignment?.top_story_4,
  ].filter(Boolean);

  const { data: featuredStories } = await supabase
    .from('stories')
    .select('id, title, tease, mux_thumbnail_url')
    .in('id', assignedIds);

  const heroStory = featuredStories?.find(s => s.id === assignment?.hero_story_id) || null;
  const topStories = [
    assignment?.top_story_1,
    assignment?.top_story_2,
    assignment?.top_story_3,
    assignment?.top_story_4,
  ]
    .map(id => featuredStories?.find(s => s.id === id))
    .filter(Boolean) as Story[];

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, tease, mux_thumbnail_url')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {/* Header / Navbar */}
      <header className="w-full py-4 border-b bg-[#226CE0] text-white">
        <div className="flex justify-between items-center px-4 md:px-[100px]">
          <div className="text-2xl font-bold">[Logo]</div>
          <nav><NavMenu /></nav>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-[100px] py-6 auto-rows-min">

        {/* HERO STORY */}
        <section className="md:col-span-3 bg-gray-200 rounded-lg overflow-hidden">
          {heroStory ? (
            <Link href={`/stories/${heroStory.id}`}>
              <img src={heroStory.mux_thumbnail_url} alt={heroStory.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h1 className="text-2xl font-bold">{heroStory.title}</h1>
                <p className="text-gray-700">{heroStory.tease}</p>
              </div>
            </Link>
          ) : (
            <div className="p-4 text-center text-gray-600">No hero story assigned</div>
          )}
        </section>

        {/* HS Banner Ad */}
        <section className="md:col-span-3 bg-yellow-300 rounded-lg">HS Banner Ad</section>

        {/* WEATHER BAR */}
        <section className="md:col-span-3 bg-blue-200 rounded-lg">Weather Bar</section>

        {/* Top Stories */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topStories.length > 0 ? (
            topStories.map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`} className="bg-white p-4 shadow hover:shadow-md transition block">
                {story.mux_thumbnail_url && (
                  <img src={story.mux_thumbnail_url} alt={story.title} className="w-full h-32 object-cover rounded mb-2" />
                )}
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-600">{story.tease}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-600">No top stories assigned</div>
          )}
        </div>

        {/* TS Sidebar (Right Column, Tall) */}
        <aside className="md:row-span-2 bg-gray-100 p-4">TS Sidebar</aside>

        {/* TS Banner Ad */}
        <section className="md:col-span-3 bg-yellow-200">TS Banner Ad</section>

        {/* LS Sidebar (Bottom Right) */}
        <aside className="min-h-[250px] bg-gray-300 p-4">LS Sidebar</aside>

        {/* Latest Stories from Supabase */}
        {stories?.slice(0, 10).map((story) => (
          <section key={story.id} className="md:col-span-2 bg-white p-4 shadow hover:shadow-md transition">
            <Link href={`/stories/${story.id}`}>
              {story.mux_thumbnail_url && (
                <img
                  src={story.mux_thumbnail_url}
                  alt={story.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p className="text-gray-600">{story.tease}</p>
            </Link>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full bg-black text-white text-center py-4">[Footer Placeholder]</footer>
    </div>
  );
}
