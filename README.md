# A11yGenie - AI-Powered Accessibility Search Platform

A11yGenie is a cutting-edge web application designed to make digital content more accessible and discoverable. By combining powerful content management, intelligent search, and AI-driven analysis, A11yGenie helps content creators and users ensure their digital content meets accessibility standards while providing an intuitive search experience.

### What Makes A11yGenie Special?

- **Smart Content Management**: Seamlessly manage and organize your content using Storyblok CMS with rich content blocks support
- **Lightning-Fast Search**: Powered by Algolia's robust search engine for instant, relevant results
- **AI-Powered Insights**: Leverage Google Gemini AI to analyze content accessibility, generate alt text, and provide intelligent summaries
- **WCAG Compliance**: Built-in accessibility scoring and compliance checking against WCAG standards
- **User-Friendly Interface**: Beautiful, responsive design with inline content viewing and advanced filtering

## 🎯 Project Overview

A11yGenie is an intelligent content accessibility platform that combines:
- **Storyblok CMS** for content management
- **Algolia Search** for fast, powerful search
- **Google Gemini AI** for content analysis and AI-powered summaries

## ✅ Integration Status

### Storyblok Integration
- ✅ **Content Delivery API**: Fully integrated (token configured)
- ✅ **Management API**: Configured and ready for content creation
- ✅ **SDK**: Using `@storyblok/react` for React integration
- ✅ **Content Loading**: Stories automatically loaded and displayed in search interface
- ✅ **Rich Content Rendering**: Full support for Storyblok content blocks (text, headlines, images, features)
- ✅ **Inline Content Viewer**: View full story content in modal without page redirects

### Algolia Integration  
- ✅ **Search Client**: Connected and configured
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
- Real-time search across Storyblok content + Algolia index
- Multi-source content aggregation
- AI-powered result summaries (optional toggle)
- Advanced filtering:
  - WCAG compliance filter
  - Content type filter
  - Tag-based filtering
- Accessibility scores for all content
- **Inline Content Viewer**: Click any result to view full content in modal
- **Rich Content Rendering**: Proper display of Storyblok content blocks
  - Feature blocks with name and text
  - Text paragraphs
  - Headlines (duplicates automatically filtered)
  - Images with alt text
  - Rich text content

### 3. **Hero Landing Page** (`/`)
- Beautiful gradient design
- Clear call-to-action
- Navigation to all features

## 🏗️ Architecture & File Structure

### Main Application Files
```
src/
├── App.tsx                               # Main application component
├── main.tsx                             # Application entry point
├── index.css                            # Global styles and design tokens
├── tailwind.config.ts                   # Tailwind CSS configuration
└── vite-env.d.ts                        # TypeScript environment definitions
```

### Pages
```
src/pages/
├── Index.tsx                            # Home page with hero section
├── Search.tsx                           # Search page wrapper
├── Analyzer.tsx                         # Content analyzer page
└── NotFound.tsx                         # 404 error page
```

### Components
```
src/components/
├── Hero.tsx                             # Landing page hero section
├── SearchInterface.tsx                  # Basic search interface
├── ContentAnalyzer.tsx                  # Content analysis component
└── EnhancedSearchInterface.tsx          # Advanced search with AI (598 lines)
    ├── Multi-source search (Algolia + Storyblok)
    ├── AI enhancement toggle
    ├── Advanced filtering system
    ├── Inline content modal
    └── Rich content block rendering
```

### UI Components (Shadcn/UI)
```
src/components/ui/
├── button.tsx                           # Button component with variants
├── card.tsx                             # Card container component
├── input.tsx                            # Form input component
├── dialog.tsx                           # Modal dialog component
├── badge.tsx                            # Badge/tag component
├── checkbox.tsx                         # Checkbox input component
├── label.tsx                            # Form label component
└── [40+ other UI components]            # Complete UI component library
```

### Services & Utilities
```
src/services/
├── contentIndexer.ts                   # Content indexing service
└── geminiService.ts                     # Gemini AI integration service

src/lib/
├── storyblok.ts                        # Storyblok CMS API integration
│   ├── fetchStoryblokContent()        # Fetches all stories
│   └── StoryblokContent interface     # TypeScript types
└── utils.ts                            # Utility functions (cn, etc.)

src/hooks/
├── use-mobile.tsx                      # Mobile device detection hook
└── use-toast.ts                        # Toast notification hook
```

### Backend Integration
```
supabase/
├── config.toml                         # Supabase configuration
└── functions/
    └── gemini-ai/
        └── index.ts                    # Gemini AI edge function
```

## 🔧 Technical Integration Details

### Content Management (Storyblok)
- **API**: Content Delivery API v2
- **Token**: Configured in `src/lib/storyblok.ts`
- **Content Types Supported**:
  - `feature`: Text content blocks with name/text fields
  - `text`: Paragraph content
  - `headline`: Section headings
  - `image`: Images with alt text
  - `richtext`: HTML content blocks
- **Content Processing**: 
  - Automatic text extraction from body blocks
  - Rich body block preservation for rendering
  - Duplicate headline filtering

### Search Technology (Algolia)
- **App ID**: Configured in `src/components/EnhancedSearchInterface.tsx`
- **Search Key**: Configured in `src/components/EnhancedSearchInterface.tsx`
- **Index**: `prod_a11ygenie`
- **SDK**: `algoliasearch@5.39.0` (lite client)
- **Features**: 
  - Real-time search as you type
  - 20 results per page
  - Multi-attribute search

### AI Integration (Gemini)
- **Model**: `gemini-2.0-flash`
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Use Cases**: 
  - Content summarization (2-3 sentences)
  - Accessibility insights
  - Result ranking and relevance
- **Implementation**: Direct API calls from frontend

### Styling & Design
- **Framework**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui component library
- **Design Tokens**: HSL-based color system in `index.css`
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG AA compliant color contrasts

## 🎯 Key Features by File

### `src/components/EnhancedSearchInterface.tsx` (598 lines)
**Main Search Component** - Handles all search functionality:
- **Lines 1-28**: Imports and TypeScript interfaces
- **Lines 29-114**: Component state and Storyblok integration
- **Lines 115-153**: Algolia search integration
- **Lines 154-199**: Filtering logic (WCAG, type, tags)
- **Lines 200-245**: AI enhancement with Gemini
- **Lines 246-344**: Search result rendering
- **Lines 345-498**: Main UI layout with filters
- **Lines 500-596**: Content viewer modal with rich block rendering

### `src/lib/storyblok.ts` (79 lines)
**Storyblok Integration** - Manages CMS content:
- Fetches home story and all published stories
- Processes content into standardized format
- Error handling for API failures
- TypeScript interfaces for type safety

### `src/services/geminiService.ts`
**AI Service** - Gemini integration:
- Content analysis and summarization
- Accessibility scoring
- Alt text generation
- Error handling

### `src/index.css`
**Design System** - Global styles:
- HSL color palette for theming
- Typography scale
- Component base styles
- Responsive utilities
- Dark/light mode support

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage Guide

1. **Home Page** (`/`): 
   - Navigate to landing page with hero section
   - Click "Try Smart Search" to explore features

2. **Smart Search** (`/search`):
   - Type in search bar for real-time results
   - Use sidebar filters to refine results
   - Toggle "AI-Enhanced Results" for AI summaries
   - Click any result card to view full content
   - Modal opens with complete story content
   - Close modal to return to search results

3. **Content Analyzer** (`/analyzer`):
   - Upload images for accessibility analysis
   - Get AI-generated alt text suggestions
   - View accessibility scores

## 🔍 Search Capabilities

- **Real-time Search**: Instant results as you type
- **Multi-Source**: Combines Algolia index + Storyblok CMS
- **Smart Filtering**: 
  - Content type (Story, Blog, Page, etc.)
  - Tags (accessibility, WCAG, SEO, etc.)
  - WCAG compliance status
- **AI Enhancement**: Optional Gemini AI summaries
- **Rich Content**: Full Storyblok content block rendering
- **Inline Viewing**: No page redirects, modal-based viewing

## 🎨 Design System

The application uses a comprehensive design system:
- **Colors**: HSL-based semantic tokens in `index.css`
- **Typography**: Responsive scale with proper hierarchy
- **Components**: Consistent variants across UI elements
- **Accessibility**: WCAG AA compliant contrasts
- **Responsive**: Mobile-first breakpoints

## 🔑 API Keys & Configuration

All API keys are securely configured in the project code. To use this project with your own services, you'll need to obtain and configure:

- **Storyblok Delivery API Token**: Get from [Storyblok Dashboard](https://app.storyblok.com/) → Settings → Access Tokens
- **Storyblok Management API Token**: Get from Storyblok Dashboard for content creation features
- **Algolia App ID & Search Key**: Get from [Algolia Dashboard](https://www.algolia.com/) → API Keys
- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Configuration Files:**
- Storyblok: `src/lib/storyblok.ts`
- Algolia: `src/components/EnhancedSearchInterface.tsx`
- Gemini AI: `src/services/geminiService.ts`

## 🛠 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn-ui components
- React Router for navigation

**Content & Search:**
- Storyblok CMS (Delivery API)
- Algolia Search (lite client)
- Multi-source content aggregation

**AI & Analysis:**
- Google Gemini 2.0 Flash
- Custom AI service for accessibility analysis
- Real-time content enhancement

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

Built with ❤️ using React, TypeScript, Tailwind CSS, Storyblok, Algolia, and Gemini AI
