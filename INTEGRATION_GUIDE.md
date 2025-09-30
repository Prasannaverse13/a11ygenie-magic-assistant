# A11yGenie Integration Guide

## 🔄 Complete Workflow Architecture

### 1. Content Source (Storyblok CMS)

All content is stored in Storyblok with the following structure:

```json
{
  "title": "Getting Started with Accessibility",
  "description": "Learn the fundamentals...",
  "body": "Full content here...",
  "type": "Tutorial",
  "tags": ["accessibility", "WCAG"],
  "accessibility_score": 95,
  "wcag_compliant": true,
  "alt_text": "Generated alt text..."
}
```

### 2. Indexing Pipeline (Storyblok → Algolia)

**Option A: Algolia Crawler (Recommended)**
1. Set up Algolia Crawler in your Algolia dashboard
2. Point it to your Storyblok Delivery API endpoint
3. Configure extractors to parse Storyblok's JSON format
4. Schedule automatic crawls (hourly/daily)

**Option B: Webhook-Based Indexing**
1. Create a Storyblok webhook that triggers on content publish
2. Set up an edge function to receive webhook events
3. Transform Storyblok data to Algolia format
4. Push to Algolia using Admin API key

**Option C: Manual Indexing Script**
Use the provided `contentIndexer.ts` service:
```typescript
import { indexStoryblokContent } from '@/services/contentIndexer';
await indexStoryblokContent();
```

### 3. Search Layer (Algolia InstantSearch)

The `EnhancedSearchInterface` component provides:
- Real-time search with Algolia InstantSearch
- Content type filtering (Tutorial, Feature, Documentation, Tool)
- Tag-based filtering
- WCAG compliance filtering
- Accessibility score display

### 4. AI Enhancement (Gemini AI)

When AI Enhancement is enabled:
1. Search results are fetched from Algolia
2. Top 3 results are sent to Gemini AI
3. AI generates a contextual summary highlighting:
   - Most accessible content
   - Best matches for the query
   - Recommendations based on accessibility
4. Summary is displayed on the top result

### 5. Accessibility Scoring System

Each piece of content receives a score (0-100) based on:
- **Alt text presence** (20 points)
- **Proper heading structure** (20 points)
- **Color contrast compliance** (20 points)
- **Keyboard navigation** (20 points)
- **Screen reader compatibility** (20 points)

**WCAG Compliance Levels:**
- Score ≥ 90: AAA Compliant (Best)
- Score ≥ 80: AA Compliant (Good)
- Score < 80: Partially Compliant (Needs improvement)

## 🔧 Setup Instructions

### 1. Configure Storyblok

1. Create a Storyblok account at https://app.storyblok.com
2. Create a new Space
3. Get your Preview Access Token from Settings → Access Tokens
4. Update `src/lib/storyblok.ts`:

```typescript
const { storyblokApi } = storyblokInit({
  accessToken: "YOUR_ACTUAL_TOKEN_HERE",
  use: [apiPlugin],
});
```

### 2. Configure Algolia

**Already configured:**
- Application ID: `TN67USW4JI`
- Search API Key: `d63f17ac9614dcbc1fb080b300967367`
- Index Name: `prod_a11ygenie`

**To populate the index:**

1. Use demo data (temporary):
   - The app currently shows demo results automatically
   - See `src/services/contentIndexer.ts` → `generateDemoData()`

2. Set up Algolia Crawler (production):
   - Go to https://www.algolia.com/apps/TN67USW4JI/crawler
   - Create a new crawler
   - Configure URL: Your Storyblok Delivery API endpoint
   - Set extraction rules for Storyblok JSON format

3. Use Storyblok-Algolia Integration:
   - Install the Algolia app from Storyblok App Directory
   - Configure automatic indexing on publish

### 3. Test the Integration

1. Start the development server
2. Navigate to `/search`
3. Try searching for:
   - "accessibility" → See tutorials and guides
   - "alt text" → See AI-powered features
   - "Storyblok" → See integration documentation
4. Enable filters:
   - Toggle "AI-Enhanced Results" to see AI summaries
   - Check "Only WCAG Compliant" to filter results
   - Select content types and tags

## 🎨 UI Features

### Search Results Display

Each result shows:
- **Title** with hover effect
- **AI Summary** (when AI Enhancement is enabled)
- **Description** of the content
- **Content Type** badge (Tutorial, Feature, etc.)
- **Accessibility Score** with visual indicator
- **WCAG Compliance Status** (✓ Compliant / ⚠ Partial)
- **Tags** for quick categorization
- **Read More** link to full content

### Filters Sidebar

- **AI Enhancement Toggle**: Enable/disable AI-powered summaries
- **WCAG Compliance Filter**: Show only compliant content
- **Content Type Facets**: Filter by Tutorial, Feature, Documentation, Tool
- **Tag Facets**: Filter by specific tags (accessibility, WCAG, AI, etc.)

### Responsive Design

- **Desktop**: 4-column layout with sidebar filters
- **Tablet**: Stacked layout with collapsible filters
- **Mobile**: Single column with drawer-based filters

## 🚀 Production Deployment

### 1. Indexing Strategy

**Recommended: Algolia Crawler**
- Crawls Storyblok content automatically
- No server-side code required
- Handles updates and deletions
- Schedule: Daily or on-demand

**Alternative: Webhook + Edge Function**
```typescript
// supabase/functions/sync-algolia/index.ts
serve(async (req) => {
  const { story } = await req.json();
  
  // Transform Storyblok story to Algolia record
  const record = {
    objectID: story.uuid,
    title: story.content.title,
    // ... other fields
  };
  
  // Push to Algolia using Admin API
  // (Requires ALGOLIA_ADMIN_KEY secret)
});
```

### 2. Environment Variables

Add to your production environment:
- `VITE_STORYBLOK_TOKEN`: Your Storyblok access token
- `VITE_ALGOLIA_APP_ID`: TN67USW4JI (already set)
- `VITE_ALGOLIA_SEARCH_KEY`: d63f17ac9614dcbc1fb080b300967367 (already set)

### 3. Performance Optimization

- Algolia results are cached automatically
- AI enhancement is optional (disable for faster searches)
- Lazy load search results using pagination
- Use Algolia's edge network for low latency

## 📊 Analytics & Monitoring

### Track Search Analytics

Algolia provides built-in analytics:
- Most searched queries
- Click-through rates
- Zero-result searches
- Popular content types

### Monitor AI Usage

Track Gemini AI API calls:
- Number of AI enhancements
- Average response time
- Error rates
- Cost per search

## 🔒 Security

### API Keys

- **Algolia Search Key**: Read-only, safe for client-side
- **Algolia Admin Key**: Server-side only, for indexing
- **Storyblok Token**: Preview tokens are safe for client-side
- **Gemini API Key**: Should be moved to edge function for production

### Best Practices

1. Never expose admin/write API keys in frontend code
2. Use environment variables for all tokens
3. Implement rate limiting for AI features
4. Validate and sanitize search queries
5. Use CORS headers appropriately

## 🎯 Next Steps

1. **Connect Real Storyblok Content**
   - Create content components in Storyblok
   - Add accessibility metadata fields
   - Publish test content

2. **Set Up Algolia Indexing**
   - Configure crawler or webhook
   - Test indexing pipeline
   - Verify search results

3. **Enhance AI Features**
   - Move Gemini API to edge function
   - Add personalized recommendations
   - Implement search result ranking

4. **Add Content Management**
   - Create admin panel for content review
   - Add bulk accessibility scanning
   - Generate reports for compliance

5. **Mobile App Integration**
   - Implement React Native preview
   - Add offline search capability
   - Sync accessibility settings

## 📚 Resources

- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [Algolia InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/)
- [Algolia Crawler Setup](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
