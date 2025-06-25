import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import NavMenu from '@/components/NavMenu';
import { fetchAllsiteAd } from '@/lib/fetchAllsiteAd';
import { fetchRotatingAds } from '@/lib/fetchRotatingAds';
import RotatingBanner from '@/components/RotatingBanner';
import { startOfToday } from 'date-fns';

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
  .maybeSingle();

  console.log('Assignment:', assignment);

  const assignedIds = [
    assignment?.hero_story_id,
    assignment?.top_story_1,
    assignment?.top_story_2,
    assignment?.top_story_3,
    assignment?.top_story_4,
  ].filter(Boolean);

  console.log('Assigned IDs:', assignedIds);

  const today = startOfToday().toISOString();

  const { data: hsAds } = await supabase
    .from('ads')
    .select('*')
    .eq('type', 'hsbanner')
    .lte('start_date', today)
    .gte('end_date', today);

  const { data: tsAds } = await supabase
    .from('ads')
    .select('*')
    .eq('type', 'tsbanner')
    .lte('start_date', today)
    .gte('end_date', today);

  const allsiteAd = await fetchAllsiteAd();

 const cleanIds = assignedIds.map((id) => String(id).trim());

console.log('Cleaned assigned IDs:', cleanIds);

const { data: assignments, error: assignmentError } = await supabase
  .from('assignments')
  .select('hero_story_id, top_story_1, top_story_2, top_story_3, top_story_4')
  .order('updated_at', { ascending: false })
  .limit(1);

console.log('Assignment:', assignment);


console.log('Featured Stories:', featuredStories);
console.error('Story Fetch Error:', storyError);


  console.log('Featured Stories:', featuredStories);
  console.log('Trying to match hero_story_id:', assignment?.hero_story_id);

  const heroStory =
    featuredStories?.find((s) => String(s.id) === String(assignment?.hero_story_id)) || null;

  console.log('Resolved Hero Story:', heroStory);

  const topStories = [
    assignment?.top_story_1,
    assignment?.top_story_2,
    assignment?.top_story_3,
    assignment?.top_story_4,
  ]
    .map((id) => featuredStories?.find((s) => String(s.id) === String(id)))
    .filter(Boolean) as Story[];

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, tease, mux_thumbnail_url')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {allsiteAd && (
        <div className="w-full bg-white shadow">
          <img src={allsiteAd.image_url} alt="Sitewide Ad" className="w-full h-auto" />
        </div>
      )}

      <header className="w-full py-4 border-b bg-[#226CE0] text-white">
        <div className="flex justify-between items-center px-4 md:px-[100px]">
          <div className="text-2xl font-bold">[Logo]</div>
          <nav><NavMenu /></nav>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-[100px] py-6 auto-rows-min">
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

        <section className="md:col-span-3 bg-yellow-300 rounded-lg">
          {hsAds && hsAds.length > 0 && <RotatingBanner ads={hsAds} />}
        </section>

        <section className="md:col-span-3 bg-blue-200 rounded-lg">Weather Bar</section>

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

        <aside className="md:row-span-2 bg-gray-100 p-4">TS Sidebar</aside>

        <section className="md:col-span-3 bg-yellow-200">
          {tsAds && tsAds.length > 0 && <RotatingBanner ads={tsAds} />}
        </section>

        <aside className="min-h-[250px] bg-gray-300 p-4">LS Sidebar</aside>

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

      <footer className="w-full bg-black text-white text-center py-4">[Footer Placeholder]</footer>
    </div>
  );
}
