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
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?token=${STORYBLOK_TOKEN}&version=published&per_page=100`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.stories.length} stories from Storyblok`);
    return data.stories as StoryblokContent[];
  } catch (error) {
    console.error("❌ Error fetching Storyblok content:", error);
    return [];
  }
}
