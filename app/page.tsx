import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';


export default async function HomePage() {
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
      {/* Header */}
      <header className="w-full py-4 border-b">
        <div className="flex justify-between items-center mx-[100px]">
          <div className="text-2xl font-bold">[Logo]</div>
          <nav className="space-x-4">[Navigation]</nav>
        </div>
      </header>

      {/* Grid Layout */}
      <main className="master-css-grid">
        <section className="col-span-3 bg-gray-200">Hero Story</section>
        <section className="col-span-3 bg-yellow-300">HS Banner Ad</section>
        <section className="col-span-3 bg-blue-200">Weather Bar</section>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow">Top Story 1</div>
          <div className="bg-white p-4 shadow">Top Story 2</div>
          <div className="bg-white p-4 shadow">Top Story 3</div>
          <div className="bg-white p-4 shadow">Top Story 4</div>
        </div>

        <aside className="row-span-2 bg-gray-100 p-4">TS Sidebar</aside>

        <section className="col-span-3 bg-yellow-200">TS Banner Ad</section>

        <aside className="min-h-[250px] bg-gray-300 p-4">LS Sidebar</aside>

        {stories?.slice(0, 10).map((story) => (
  <section key={story.id} className="col-span-2 bg-white p-4 shadow hover:shadow-md transition">
    <Link href={`/stories/${story.id}`}>
      {story.mux_thumbnail_url && (
        <img src={story.mux_thumbnail_url} alt={story.title} className="w-full h-40 object-cover rounded mb-2" />
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