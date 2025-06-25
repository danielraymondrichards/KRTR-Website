import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('hero_story_id, top_story_1, top_story_2, top_story_3, top_story_4')
    .limit(1)
    .single();

  const assignedIds = [
    assignment?.hero_story_id,
    assignment?.top_story_1,
    assignment?.top_story_2,
    assignment?.top_story_3,
    assignment?.top_story_4,
  ].filter(Boolean);

  const { data: stories, error: storyError } = await supabase
    .from('stories')
    .select('*')
    .in('id', assignedIds)
    .eq('is_published', true);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Test Page</h1>

      <section>
        <h2 className="font-semibold text-xl mb-2">Assignment</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(assignment, null, 2)}</pre>
        {assignmentError && <p className="text-red-500">Error: {assignmentError.message}</p>}
      </section>

      <section>
        <h2 className="font-semibold text-xl mb-2">Stories</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(stories, null, 2)}</pre>
        {storyError && <p className="text-red-500">Error: {storyError.message}</p>}
      </section>
    </div>
  );
}
