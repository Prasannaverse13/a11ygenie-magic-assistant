import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Search as SearchIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { liteClient } from "algoliasearch/lite";

interface EnhancedResult {
  objectID: string;
  title: string;
  description: string;
  type: string;
  content?: string;
  tags?: string[];
  accessibility_score?: number;
  wcag_compliant?: boolean;
  url?: string;
  alt_text?: string;
  aiEnhanced?: boolean;
  aiSummary?: string;
}

const EnhancedSearchInterface = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [aiEnhancementEnabled, setAiEnhancementEnabled] = useState(false);
  const [onlyCompliant, setOnlyCompliant] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [results, setResults] = useState<EnhancedResult[]>([]);
  const [enhancing, setEnhancing] = useState(false);
  const [selectedStory, setSelectedStory] = useState<EnhancedResult | null>(null);

  // Algolia client
  const searchClient = useMemo(() => liteClient('TN67USW4JI', 'd63f17ac9614dcbc1fb080b300967367'), []);

  // Results from Algolia + Storyblok
  const [allResults, setAllResults] = useState<EnhancedResult[]>([]);
  const [storyblokLoaded, setStoryblokLoaded] = useState(false);
  
  // Extract unique types and tags for filters
  const allTypes = useMemo(() => Array.from(new Set(allResults.map(r => r.type))).filter(Boolean), [allResults]);
  const allTags = useMemo(() => Array.from(new Set(allResults.flatMap(r => r.tags || []))).filter(Boolean), [allResults]);

  // Helper to extract text from Storyblok body blocks
  const extractTextFromStoryblokBody = (body: any): string => {
    if (!body) return '';
    if (typeof body === 'string') return body;
    
    // Handle array of blocks
    if (Array.isArray(body)) {
      return body
        .map(block => {
          if (typeof block === 'string') return block;
          if (block.text) return block.text;
          if (block.headline) return block.headline;
          if (block.content) return extractTextFromStoryblokBody(block.content);
          return '';
        })
        .filter(Boolean)
        .join(' ')
        .slice(0, 200);
    }
    
    // Handle object with text/headline
    if (body.text) return body.text;
    if (body.headline) return body.headline;
    
    return 'No description';
  };

  // Load Storyblok content on mount
  useEffect(() => {
    const loadStoryblok = async () => {
      try {
        const { fetchStoryblokContent } = await import('@/lib/storyblok');
        const stories = await fetchStoryblokContent();
        
        const storyblokResults: EnhancedResult[] = stories.map(story => {
          const bodyText = extractTextFromStoryblokBody(story.content?.body);
          
          return {
            objectID: story.uuid,
            title: story.content?.title || story.name,
            description: story.content?.description || bodyText || 'No description',
            type: story.content?.type || story.content?.category || 'Story',
            content: bodyText,
            tags: story.content?.tags || [],
            accessibility_score: story.content?.accessibility_score || 85,
            wcag_compliant: story.content?.wcag_compliant !== false,
            url: `https://app.storyblok.com/#!/me/spaces/your-space/stories/0/${story.full_slug}`,
            alt_text: story.content?.alt_text,
          };
        });
        
        setAllResults(prev => [...storyblokResults, ...prev]);
        setStoryblokLoaded(true);
        console.log(`✅ Loaded ${storyblokResults.length} stories from Storyblok`);
      } catch (error) {
        console.error('Failed to load Storyblok content:', error);
        setStoryblokLoaded(true);
      }
    };
    
    loadStoryblok();
  }, []);

  // Fetch Algolia results when query changes
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!searchQuery.trim()) {
        setAllResults([]);
        setResults([]);
        return;
      }
      try {
        const response: any = await searchClient.search({
          requests: [
            { indexName: 'prod_a11ygenie', query: searchQuery, hitsPerPage: 20 },
          ],
        });
        const hits = (response?.results?.[0]?.hits || []) as any[];
        const mapped: EnhancedResult[] = hits.map((h, i) => ({
          objectID: String(h.objectID ?? i),
          title: h.title ?? h.name ?? 'Untitled',
          description: h.description ?? h.content ?? '',
          type: h.type ?? h.category ?? 'Content',
          content: h.content,
          tags: h.tags ?? [],
          accessibility_score: h.accessibility_score ?? h.readabilityScore ?? undefined,
          wcag_compliant: h.wcag_compliant ?? h.isCompliant ?? undefined,
          url: h.url ?? h.link ?? (h.full_slug ? `/${h.full_slug}` : undefined),
          alt_text: h.alt_text ?? h.altText,
        }));
        if (active) setAllResults(mapped);
      } catch (e) {
        console.error('Algolia search error:', e);
        if (active) setAllResults([]);
      }
    };
    run();
    return () => { active = false; };
  }, [searchQuery, searchClient]);

  // Apply filters and optional AI enhancement
  useEffect(() => {
    filterResults();
  }, [searchQuery, onlyCompliant, selectedTypes, selectedTags, aiEnhancementEnabled, allResults]);

  const filterResults = async () => {
    let filtered = [...allResults];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    // WCAG compliance filter
    if (onlyCompliant) {
      filtered = filtered.filter(r => r.wcag_compliant);
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(r => selectedTypes.includes(r.type));
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(r =>
        r.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // AI Enhancement
    if (aiEnhancementEnabled && filtered.length > 0 && searchQuery.trim()) {
      setEnhancing(true);
      const enhanced = await enhanceResultsWithAI(filtered);
      setResults(enhanced);
      setEnhancing(false);
    } else {
      setResults(filtered);
    }
  };

  const enhanceResultsWithAI = async (results: EnhancedResult[]): Promise<EnhancedResult[]> => {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyDWCgAHBZJFyyLJLMDkbxafv9ssJ4hfu2E',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an accessibility expert. Analyze these search results for "${searchQuery}" and provide a brief summary (2-3 sentences) highlighting the most accessible and relevant content. 

Results:
${results.slice(0, 3).map(r => `- ${r.title}: ${r.description} (Score: ${r.accessibility_score})`).join('\n')}

Provide only the summary text, no formatting.`
                  }
                ]
              }
            ]
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return results.map((result, idx) => ({
          ...result,
          aiEnhanced: idx === 0,
          aiSummary: idx === 0 ? aiSummary : undefined,
        }));
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
    }

    return results;
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const Hit = ({ hit }: { hit: EnhancedResult }) => {
    const score = hit.accessibility_score || 85;
    const isCompliant = hit.wcag_compliant !== undefined ? hit.wcag_compliant : score >= 80;

    return (
      <Card
        className="p-6 hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-primary"
        onClick={() => setSelectedStory(hit)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedStory(hit);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {hit.title}
              </h3>
              {hit.aiEnhanced && (
                <Badge variant="secondary" className="bg-gradient-to-r from-primary to-accent text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
            </div>

            {hit.aiSummary && (
              <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground italic">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  {hit.aiSummary}
                </p>
              </div>
            )}

            <p className="text-muted-foreground mb-3">{hit.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline">{hit.type}</Badge>
              
              <div className="flex items-center gap-2">
                {isCompliant ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">
                  {isCompliant ? "WCAG Compliant" : "Partially Compliant"}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Score: {score}
                </Badge>
              </div>

              {hit.tags && hit.tags.length > 0 && (
                <div className="flex gap-1">
                  {hit.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button 
              variant="link" 
              className="mt-3 p-0 h-auto text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStory(hit);
              }}
              aria-label={`Read more about ${hit.title}`}
            >
              View Content →
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Smart Content Search
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered search with Algolia + Storyblok integration
          </p>
        </div>

        {/* Integration Status */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>
              {storyblokLoaded 
                ? "✅ Connected to Storyblok CMS • Content loaded from your space"
                : "⏳ Loading content from Storyblok..."}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Filters & AI
              </h3>

              <div className="space-y-6">
                {/* AI Enhancement Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ai-enhance"
                      checked={aiEnhancementEnabled}
                      onCheckedChange={(checked) => setAiEnhancementEnabled(checked as boolean)}
                    />
                    <Label htmlFor="ai-enhance" className="text-sm cursor-pointer">
                      AI-Enhanced Results
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Use Gemini AI to summarize and rank results
                  </p>
                </div>

                {/* WCAG Compliance Filter */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wcag-only"
                      checked={onlyCompliant}
                      onCheckedChange={(checked) => setOnlyCompliant(checked as boolean)}
                    />
                    <Label htmlFor="wcag-only" className="text-sm cursor-pointer">
                      Only WCAG Compliant
                    </Label>
                  </div>
                </div>

                {/* Content Type Filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Content Type</h4>
                  <div className="space-y-2">
                    {allTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allTags.slice(0, 10).map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for accessible content, tutorials, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-border focus:border-primary transition-colors"
              />
              {enhancing && (
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
              )}
            </div>

            {results.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            )}

            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((result) => <Hit key={result.objectID} hit={result} />)
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery 
                      ? `No results found for "${searchQuery}"`
                      : "Start typing to search for accessible content"}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Content Viewer Modal */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold pr-8">
                {selectedStory?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedStory && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline">{selectedStory.type}</Badge>
                  
                  <div className="flex items-center gap-2">
                    {selectedStory.wcag_compliant ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      {selectedStory.wcag_compliant ? "WCAG Compliant" : "Partially Compliant"}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      Score: {selectedStory.accessibility_score || 85}
                    </Badge>
                  </div>

                  {selectedStory.tags && selectedStory.tags.length > 0 && (
                    <div className="flex gap-1">
                      {selectedStory.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {selectedStory.description && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground">{selectedStory.description}</p>
                  </div>
                )}

                {selectedStory.content && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Full Content</h3>
                    <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedStory.content}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnhancedSearchInterface;
