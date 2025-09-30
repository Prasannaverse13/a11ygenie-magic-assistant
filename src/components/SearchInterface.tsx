import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { liteClient } from "algoliasearch/lite";

const searchClient = liteClient('TN67USW4JI', 'd63f17ac9614dcbc1fb080b300967367');

interface SearchResult {
  objectID: string;
  title: string;
  description: string;
  url?: string;
  category?: string;
  [key: string]: any;
}

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setSearching(true);
      try {
        const response: any = await searchClient.search({
          requests: [
            {
              indexName: 'prod_a11ygenie',
              query: query,
              hitsPerPage: 10,
            },
          ],
        });
        
        const hits = response.results?.[0]?.hits || [];
        setResults(hits as SearchResult[]);
      } catch (error) {
        console.error('Search error:', error);
        // Show demo results if index doesn't exist yet
        setResults([
          {
            objectID: '1',
            title: 'Getting Started with Accessibility',
            description: 'Learn the fundamentals of web accessibility and WCAG guidelines.',
            category: 'Tutorial',
          },
          {
            objectID: '2',
            title: 'AI-Powered Alt Text Generation',
            description: 'Automatically generate descriptive alt text for images using AI.',
            category: 'Feature',
          },
          {
            objectID: '3',
            title: 'Storyblok Integration Guide',
            description: 'Connect your Storyblok CMS with A11yGenie for automated accessibility checks.',
            category: 'Documentation',
          },
        ]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Smart Content Search
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered search with Algolia for intelligent content discovery
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for accessible content, tutorials, or features..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-border focus:border-primary transition-colors"
          />
          {searching && (
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
          )}
        </div>

        {query && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((result) => (
              <Card 
                key={result.objectID} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {result.description}
                    </p>
                    {result.category && (
                      <Badge variant="secondary">{result.category}</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {query && results.length === 0 && !searching && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No results found for "{query}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try different keywords or check your spelling
            </p>
          </Card>
        )}

        {!query && (
          <Card className="p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">
              Start typing to search for accessible content
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;
