# A11yGenie - AI-Powered Accessibility Search Platform

**Live URL**: https://lovable.dev/projects/204454d3-fbfc-44b8-822b-c69304423544

## 🎯 Project Overview

A11yGenie is an intelligent content accessibility platform that combines:
- **Storyblok CMS** for content management
- **Algolia Search** for fast, powerful search
- **Google Gemini AI** for content analysis and AI-powered summaries

## ✅ Integration Status

### Storyblok Integration
- ✅ **Content Delivery API**: Fully integrated with token `0O6ZxQpRTS9AkqywIUJfLQtt`
- ✅ **Management API**: Configured with token (ready for content creation)
- ✅ **SDK**: Using `@storyblok/react` for React integration
- ✅ **Content Loading**: Stories automatically loaded and displayed in search interface

### Algolia Integration  
- ✅ **Search Client**: Connected with App ID `TN67USW4JI`
- ✅ **Search UI**: Using `algoliasearch` SDK for instant search
- ✅ **Index**: Searching `prod_a11ygenie` index
- ⚠️ **Crawler**: Needs setup (see Algolia dashboard to configure crawler)

### Google Gemini AI
- ✅ **API Integration**: Using Gemini 2.0 Flash model
- ✅ **Content Analyzer**: AI-powered accessibility scoring and alt-text generation
- ✅ **Search Enhancement**: AI summaries for search results
- ✅ **Direct API Calls**: Configured for hackathon use (no cloud needed)

## 📊 Features

### 1. **Content Analyzer** (`/analyzer`)
- Upload images for accessibility analysis
- AI-generated alt text recommendations
- Accessibility score calculation
- WCAG compliance checking

### 2. **Smart Search** (`/search`)
- Real-time search across Storyblok content
- AI-powered result summaries
- Filter by WCAG compliance, content type, and tags
- Accessibility scores for all content

### 3. **Hero Landing Page** (`/`)
- Beautiful gradient design
- Clear call-to-action
- Navigation to all features

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/204454d3-fbfc-44b8-822b-c69304423544) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn-ui components
- React Router for navigation

**Content & Search:**
- Storyblok CMS (Delivery + Management APIs)
- Algolia Search (Search UI SDK)
- React InstantSearch integration

**AI & Analysis:**
- Google Gemini 2.0 Flash
- Custom AI service for accessibility analysis
- Real-time content enhancement

## 🔑 API Keys & Configuration

All API keys are already configured in the project:

```
Storyblok Delivery API: 0O6ZxQpRTS9AkqywIUJfLQtt
Storyblok Management API: yl1596NDIPLtzLtz4q83nwtt-96326388814558-eLKSijRmsm158oosFi6W
Algolia App ID: TN67USW4JI
Algolia Search Key: d63f17ac9614dcbc1fb080b300967367
Gemini API Key: [Configured in geminiService.ts]
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ContentAnalyzer.tsx          # Image analysis tool
│   ├── EnhancedSearchInterface.tsx  # Smart search with AI
│   ├── Hero.tsx                     # Landing page hero
│   └── ui/                          # shadcn components
├── lib/
│   └── storyblok.ts                 # Storyblok API integration
├── services/
│   ├── geminiService.ts             # Gemini AI service
│   └── contentIndexer.ts            # Algolia indexing utilities
├── pages/
│   ├── Index.tsx                    # Home page
│   ├── Search.tsx                   # Search page
│   └── Analyzer.tsx                 # Content analyzer page
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/204454d3-fbfc-44b8-822b-c69304423544) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
