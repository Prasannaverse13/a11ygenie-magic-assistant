// Storyblok Content Delivery API integration
const STORYBLOK_TOKEN = "0O6ZxQpRTS9AkqywIUJfLQtt";

export interface StoryblokContent {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: {
    title?: string;
    description?: string;
    body?: string;
    category?: string;
    type?: string;
    tags?: string[];
    accessibility_score?: number;
    wcag_compliant?: boolean;
    alt_text?: string;
  };
  created_at: string;
  published_at: string;
}

export async function fetchStoryblokContent(): Promise<StoryblokContent[]> {
  try {
    const stories: StoryblokContent[] = [];
    
    // Fetch the home story specifically
    try {
      const homeResponse = await fetch(
        `https://api.storyblok.com/v2/cdn/stories/home?token=${STORYBLOK_TOKEN}&version=published`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (homeResponse.ok) {
        const homeData = await homeResponse.json();
        if (homeData.story) {
          stories.push(homeData.story);
          console.log('✅ Fetched "home" story from Storyblok');
        }
      }
    } catch (error) {
      console.warn('Could not fetch home story:', error);
    }
    
    // Also try to fetch all stories
    try {
      const allResponse = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?token=${STORYBLOK_TOKEN}&version=published&per_page=100`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (allResponse.ok) {
        const allData = await allResponse.json();
        if (allData.stories && allData.stories.length > 0) {
          stories.push(...allData.stories);
          console.log(`✅ Fetched ${allData.stories.length} additional stories from Storyblok`);
        }
      }
    } catch (error) {
      console.warn('Could not fetch all stories:', error);
    }

    console.log(`✅ Total Storyblok stories loaded: ${stories.length}`);
    return stories as StoryblokContent[];
  } catch (error) {
    console.error("❌ Error fetching Storyblok content:", error);
    return [];
  }
}
