// app/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface Story {
  id: string;
  title: string;
  body: string;
  image_url: string;
  is_published: boolean;
}

const FALLBACK_STORY_ID = "44e97660-99ab-45f3-9b9d-2f09f5159313";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const { data: assignments, error: assignError } = await supabase
    .from("assignments")
    .select("hero_story_id, top_story_1, top_story_2, top_story_3, top_story_4")
    .single();

  if (assignError || !assignments) {
    return <div>Error loading story assignments.</div>;
  }

  const storyIds = [
    assignments.hero_story_id,
    assignments.top_story_1,
    assignments.top_story_2,
    assignments.top_story_3,
    assignments.top_story_4,
    FALLBACK_STORY_ID
  ].filter(Boolean);

  const { data: stories, error: storyError } = await supabase
    .from("stories")
    .select("id, title, body, image_url, is_published")
    .in("id", storyIds);

  if (storyError || !stories) {
    return <div>Error loading stories.</div>;
  }

  const publishedStories = stories.filter((s) => s.is_published);
  const storyMap: Record<string, Story> = Object.fromEntries(
    publishedStories.map((story) => [story.id, story])
  );

  const getStory = (id: string | null): Story | null => {
    if (id && storyMap[id]) return storyMap[id];
    return storyMap[FALLBACK_STORY_ID] || null;
  };

  const heroStory = getStory(assignments.hero_story_id);
  const topStories = [
    getStory(assignments.top_story_1),
    getStory(assignments.top_story_2),
    getStory(assignments.top_story_3),
    getStory(assignments.top_story_4)
  ].filter(Boolean);

  if (!heroStory && topStories.length === 0) {
    return <div className="animate-pulse text-gray-500">Loading stories...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {heroStory ? (
        <section className="bg-gray-200 p-6 rounded">
          <h2 className="text-2xl font-bold">Hero Story</h2>
          <h3 className="text-xl">{heroStory.title}</h3>
          <img src={heroStory.image_url} alt="Hero" className="w-full h-auto mt-2" />
          <p>{heroStory.body}</p>
        </section>
      ) : (
        <div className="h-48 bg-gray-100 animate-pulse rounded"></div>
      )}

      <section>
        <h2 className="text-xl font-bold">Top Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topStories.length > 0 ? (
            topStories.map((story) => (
              <div key={story.id} className="border p-4 rounded">
                <h4 className="font-semibold">{story.title}</h4>
                <img src={story.image_url} alt="Top" className="w-full h-auto mt-1" />
                <p className="text-sm mt-1">{story.body}</p>
              </div>
            ))
          ) : (
            <div className="h-32 bg-gray-100 animate-pulse rounded col-span-full"></div>
          )}
        </div>
      </section>
    </div>
  );
}
