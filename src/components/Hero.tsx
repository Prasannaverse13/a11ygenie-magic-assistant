import { Button } from "@/components/ui/button";
import { Sparkles, Search, Accessibility, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Accessibility Assistant</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
          Make Your Content
          <br />
          Accessible for Everyone
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          A11yGenie uses AI to automatically generate alt-text, captions, and accessibility improvements for your content. Built on Storyblok and Algolia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
            onClick={() => navigate('/analyzer')}
          >
            <Zap className="w-5 h-5 mr-2" />
            Try Content Analyzer
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/search')}
          >
            <Search className="w-5 h-5 mr-2" />
            Explore Search
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <Accessibility className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Auto Accessibility</h3>
            <p className="text-muted-foreground">
              AI generates alt-text, ARIA labels, and runs WCAG compliance checks automatically
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 mx-auto">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-muted-foreground">
              Algolia-powered AI search with intelligent recommendations and personalization
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary-glow/10 flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-primary-glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CMS Integration</h3>
            <p className="text-muted-foreground">
              Seamlessly integrates with Storyblok for real-time content enhancement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
