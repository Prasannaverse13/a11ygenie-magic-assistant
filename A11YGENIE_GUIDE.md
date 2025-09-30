# A11yGenie - AI-Powered Accessibility Assistant

## 🌟 Overview

A11yGenie is an AI-powered content accessibility and discovery platform that helps content creators make their content accessible to everyone. Built with React, Storyblok, Algolia, and Gemini AI.

## ✨ Features

### 1. **Content Accessibility Analyzer** (`/analyzer`)
- AI-powered accessibility analysis using Gemini 2.0 Flash
- Automatic alt-text generation for images
- WCAG compliance checking
- Real-time accessibility scoring (0-100)
- Actionable suggestions and improvements
- Issue categorization (errors, warnings, info)

### 2. **Smart Search Interface** (`/search`)
- Algolia-powered intelligent search
- Real-time search results
- AI-enhanced content discovery
- Category-based filtering
- Demo mode with sample results

### 3. **Beautiful Landing Page** (`/`)
- Purple-to-blue gradient design theme
- Feature showcase
- Call-to-action buttons
- Responsive design
- Animated background effects

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **AI**: Gemini 2.0 Flash (via Lovable Cloud)
- **Search**: Algolia Search
- **CMS Integration**: Storyblok (ready to integrate)
- **Backend**: Supabase Edge Functions

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (`hsl(270 70% 55%)`)
- **Accent**: Bright blue (`hsl(210 100% 55%)`)
- **Background**: Clean white/dark purple
- **Gradients**: Purple-to-blue theme throughout

### Key Design Tokens
```css
--primary: 270 70% 55%
--accent: 210 100% 55%
--primary-glow: 250 80% 65%
--gradient-primary: linear-gradient(135deg, purple, blue)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key (already configured)
- Algolia Account (App ID: TN67USW4JI)
- Storyblok Account (optional)

### Environment Setup
The following are already configured:
- `GEMINI_API_KEY`: Your Gemini API key (stored in Lovable Cloud)
- Algolia credentials are hardcoded in the search component

### Running Locally
```bash
npm install
npm run dev
```

## 📱 Pages & Routes

### Home (`/`)
Landing page with hero section and feature showcase

### Content Analyzer (`/analyzer`)
Upload or paste content for AI-powered accessibility analysis
- Enter text content or HTML
- Optionally provide image URL for alt-text generation
- Get instant accessibility score and recommendations

### Search (`/search`)
Search for accessible content using Algolia
- Real-time search as you type
- Intelligent ranking
- Category badges
- Demo mode with sample content

## 🔌 Integrations

### Gemini AI
- **Model**: `gemini-2.0-flash`
- **Endpoint**: Via Lovable Cloud Edge Function
- **Use Case**: Accessibility analysis, alt-text generation

### Algolia
- **Application ID**: TN67USW4JI
- **Search API Key**: d63f17ac9614dcbc1fb080b300967367
- **Index**: `prod_a11ygenie`
- **Features**: Real-time search, AI ranking

### Storyblok (Ready to Integrate)
The project includes Storyblok SDK. To integrate:
1. Create a Storyblok space
2. Add access token to environment
3. Create content types in Storyblok
4. Fetch and display content via Delivery API

## 🎯 Use Cases

### For Content Creators
- Never forget accessibility
- Auto-generate alt text
- Get instant WCAG compliance feedback

### For Developers
- Integrate accessibility checks into CI/CD
- Automate content enhancement
- Use CLI for workflow automation

### For End Users
- Discover accessible content easily
- AI-powered search
- Better content experience

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── Hero.tsx              # Landing page hero
│   ├── ContentAnalyzer.tsx   # Accessibility analyzer
│   └── SearchInterface.tsx   # Algolia search UI
├── pages/
│   ├── Index.tsx             # Home page
│   ├── Analyzer.tsx          # Analyzer page
│   └── Search.tsx            # Search page
└── index.css                 # Design system
```

### Backend Structure
```
supabase/functions/
└── gemini-ai/
    └── index.ts              # Gemini AI edge function
```

## 📊 Accessibility Scoring

The AI analyzes content and provides:
- **Score (0-100)**: Overall accessibility rating
  - 80-100: Excellent (Green)
  - 60-79: Good (Yellow)
  - 0-59: Needs Work (Red)

- **Issues**: Categorized problems
  - Errors: Critical accessibility issues
  - Warnings: Important but not critical
  - Info: Suggestions for improvement

- **Suggestions**: Actionable recommendations

## 🔒 Security

- API keys stored securely in Lovable Cloud
- CORS properly configured
- Edge functions with proper error handling
- No sensitive data exposed to client

## 🚀 Deployment

### Via Lovable
1. Click "Publish" button in Lovable editor
2. Your app will be deployed automatically
3. Custom domain available on paid plans

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🛣️ Roadmap

### Completed ✅
- AI-powered accessibility analyzer
- Algolia search integration
- Beautiful landing page
- Gemini AI integration
- Design system with purple-blue theme

### Planned 🚧
- Storyblok content display
- User authentication
- Save analysis history
- Export reports (PDF)
- React Native mobile preview
- CLI tools for developers
- Batch content processing
- Custom accessibility rules
- Team collaboration features

## 📚 API Reference

### Gemini AI Edge Function
```typescript
POST /functions/v1/gemini-ai
{
  "text": "Content to analyze..."
}
```

### Algolia Search
```typescript
searchClient.search({
  requests: [{
    indexName: 'prod_a11ygenie',
    query: 'search term',
    hitsPerPage: 10
  }]
})
```

## 🤝 Contributing

This is a hackathon project. Future improvements welcome!

## 📄 License

MIT License

## 🙋 Support

For issues or questions:
- Check Lovable docs: https://docs.lovable.dev
- Algolia docs: https://algolia.com/doc
- Storyblok docs: https://storyblok.com/docs

---

Built with ❤️ using Lovable, Gemini AI, Algolia, and Storyblok
