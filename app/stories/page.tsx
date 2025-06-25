import { supabase } from '@/lib/supabaseClient';

export default async function StoriesPage() {
  const { data: stories, error } = await supabase
  .from('stories')
  .select('*')
  .order('pub_date', { ascending: false });

  if (error) {
  console.error('Supabase query failed:', error.message, error.details, error.hint);
  return <div>Error loading stories: {error.message}</div>;
}

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold">Stories</h1>
      {stories?.map((story) => (
        <article key={story.id} className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-2">{story.title}</h2>
          <p className="text-sm text-gray-500 mb-4">By {story.author}</p>
          <p className="text-sm text-gray-500 mb-4">Published {story.pub_date}</p>
          <div className="prose max-w-none">{story.tease}</div>
        </article>
      ))}
    </div>
  );
}
