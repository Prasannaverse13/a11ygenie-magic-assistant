import { apiPlugin, storyblokInit, StoryblokClient } from "@storyblok/react";

// Initialize Storyblok
storyblokInit({
  accessToken: "YOUR_STORYBLOK_PREVIEW_TOKEN", // Replace with actual token
  use: [apiPlugin],
  apiOptions: {
    region: "us", // or "eu" depending on your space
  },
});

// For demo purposes, we'll use null and handle it in the fetch function
export const storyblokApi: StoryblokClient | null = null;

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

export async function fetchStoryblokContent() {
  // For demo/development, return empty array
  // In production, implement actual Storyblok API calls
  console.log("Storyblok content fetch - using demo data instead");
  
  // TODO: Implement actual Storyblok API integration
  // const { data } = await storyblokApi.get("cdn/stories", {
  //   version: "published",
  //   per_page: 100,
  // });
  // return data.stories as StoryblokContent[];
  
  return [];
}
