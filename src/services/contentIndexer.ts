import { liteClient } from "algoliasearch/lite";
import { fetchStoryblokContent, StoryblokContent } from "@/lib/storyblok";

const algoliaClient = liteClient('TN67USW4JI', 'd63f17ac9614dcbc1fb080b300967367');

interface AlgoliaRecord {
  objectID: string;
  title: string;
  description: string;
  content?: string;
  type: string;
  tags?: string[];
  accessibility_score?: number;
  wcag_compliant?: boolean;
  url: string;
  alt_text?: string;
}

/**
 * Transform Storyblok content to Algolia format
 */
export function transformToAlgoliaRecords(stories: StoryblokContent[]): AlgoliaRecord[] {
  return stories.map(story => ({
    objectID: story.uuid,
    title: story.content?.title || story.name,
    description: story.content?.description || "",
    content: story.content?.body || "",
    type: story.content?.type || story.content?.category || "Article",
    tags: story.content?.tags || [],
    accessibility_score: story.content?.accessibility_score || 85,
    wcag_compliant: story.content?.wcag_compliant !== false,
    url: `/${story.full_slug}`,
    alt_text: story.content?.alt_text,
  }));
}

/**
 * Index content from Storyblok to Algolia
 * This would typically run as a backend job/webhook
 */
export async function indexStoryblokContent() {
  try {
    // Fetch content from Storyblok
    const stories = await fetchStoryblokContent();
    
    if (stories.length === 0) {
      console.log("No stories found to index");
      return;
    }

    // Transform to Algolia format
    const records = transformToAlgoliaRecords(stories);

    console.log(`Prepared ${records.length} records for indexing`);
    
    // Note: Actual indexing requires Admin API key (write permission)
    // This should be done server-side or via Algolia Crawler
    // For demo purposes, we're using the search-only key
    
    return records;
  } catch (error) {
    console.error("Error indexing content:", error);
    throw error;
  }
}

/**
 * Generate demo data for testing
 */
export function generateDemoData(): AlgoliaRecord[] {
  return [
    {
      objectID: "1",
      title: "Getting Started with Web Accessibility",
      description: "Learn the fundamentals of web accessibility and WCAG guidelines. This comprehensive guide covers semantic HTML, ARIA attributes, and best practices.",
      content: "Web accessibility ensures that websites and applications can be used by everyone, including people with disabilities...",
      type: "Tutorial",
      tags: ["accessibility", "WCAG", "beginners", "HTML"],
      accessibility_score: 95,
      wcag_compliant: true,
      url: "/tutorials/getting-started-accessibility",
    },
    {
      objectID: "2",
      title: "AI-Powered Alt Text Generation",
      description: "Automatically generate descriptive alt text for images using AI. Improve your content accessibility with machine learning.",
      content: "Alt text is crucial for screen reader users. Our AI-powered tool analyzes images and generates contextually relevant descriptions...",
      type: "Feature",
      tags: ["AI", "alt-text", "images", "automation"],
      accessibility_score: 88,
      wcag_compliant: true,
      url: "/features/ai-alt-text",
    },
    {
      objectID: "3",
      title: "Storyblok Integration Guide",
      description: "Connect your Storyblok CMS with A11yGenie for automated accessibility checks and content optimization.",
      content: "Integrate A11yGenie seamlessly with your Storyblok workflow. Automatic scanning, real-time suggestions, and compliance reporting...",
      type: "Documentation",
      tags: ["Storyblok", "CMS", "integration", "guide"],
      accessibility_score: 92,
      wcag_compliant: true,
      url: "/docs/storyblok-integration",
    },
    {
      objectID: "4",
      title: "Color Contrast Checker Tool",
      description: "Ensure your color combinations meet WCAG AA and AAA standards for optimal readability.",
      content: "Color contrast is essential for users with visual impairments. Test your color combinations against WCAG standards...",
      type: "Tool",
      tags: ["color", "contrast", "WCAG", "design"],
      accessibility_score: 90,
      wcag_compliant: true,
      url: "/tools/color-contrast",
    },
    {
      objectID: "5",
      title: "Screen Reader Testing Best Practices",
      description: "Comprehensive guide to testing your website with popular screen readers like NVDA, JAWS, and VoiceOver.",
      content: "Screen reader testing is crucial for accessibility. Learn how to test with NVDA, JAWS, and VoiceOver effectively...",
      type: "Tutorial",
      tags: ["screen-readers", "testing", "NVDA", "JAWS"],
      accessibility_score: 87,
      wcag_compliant: true,
      url: "/tutorials/screen-reader-testing",
    },
    {
      objectID: "6",
      title: "Accessible Form Design Patterns",
      description: "Design forms that work for everyone with proper labels, error messages, and keyboard navigation.",
      content: "Forms are a common source of accessibility issues. Follow these patterns for inclusive form design...",
      type: "Tutorial",
      tags: ["forms", "UX", "design", "patterns"],
      accessibility_score: 93,
      wcag_compliant: true,
      url: "/tutorials/accessible-forms",
    },
    {
      objectID: "7",
      title: "Keyboard Navigation Implementation",
      description: "Make your web application fully navigable using only a keyboard for better accessibility.",
      content: "Keyboard navigation is essential for users who cannot use a mouse. Implement focus management, skip links, and keyboard shortcuts...",
      type: "Documentation",
      tags: ["keyboard", "navigation", "focus", "interaction"],
      accessibility_score: 91,
      wcag_compliant: true,
      url: "/docs/keyboard-navigation",
    },
    {
      objectID: "8",
      title: "Accessible Data Tables",
      description: "Create data tables that are readable by screen readers with proper headers and captions.",
      content: "Data tables can be challenging for accessibility. Use proper semantic markup with thead, tbody, th, and caption elements...",
      type: "Tutorial",
      tags: ["tables", "data", "HTML", "semantic"],
      accessibility_score: 89,
      wcag_compliant: true,
      url: "/tutorials/accessible-tables",
    },
  ];
}
