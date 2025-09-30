import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
  }>;
  suggestions: string[];
  altTextGenerated?: string;
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      // Call Gemini AI to analyze accessibility
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `Analyze the following content for accessibility issues and provide a score (0-100), specific issues (categorize as error, warning, or info), and suggestions for improvement. Also, if there's an image URL provided, generate appropriate alt text.

Content: ${content}
${imageUrl ? `Image URL: ${imageUrl}` : ''}

Return your analysis in this format:
SCORE: [number]
ISSUES:
- [type]: [message]
SUGGESTIONS:
- [suggestion]
${imageUrl ? 'ALT_TEXT: [generated alt text]' : ''}`
          }),
        }
      );

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Parse AI response
      const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
      
      const issuesSection = aiResponse.match(/ISSUES:(.*?)(?=SUGGESTIONS:|ALT_TEXT:|$)/s);
      const issues = issuesSection ? 
        issuesSection[1].trim().split('\n')
          .filter((line: string) => line.trim().startsWith('-'))
          .map((line: string) => {
            const match = line.match(/- (error|warning|info): (.*)/i);
            return match ? {
              type: match[1].toLowerCase() as 'error' | 'warning' | 'info',
              message: match[2]
            } : null;
          })
          .filter(Boolean) : [];
      
      const suggestionsSection = aiResponse.match(/SUGGESTIONS:(.*?)(?=ALT_TEXT:|$)/s);
      const suggestions = suggestionsSection ?
        suggestionsSection[1].trim().split('\n')
          .filter((line: string) => line.trim().startsWith('-'))
          .map((line: string) => line.replace(/^-\s*/, '').trim()) : [];
      
      const altTextMatch = aiResponse.match(/ALT_TEXT:\s*(.*)/);
      const altTextGenerated = altTextMatch ? altTextMatch[1].trim() : undefined;

      setResult({
        score,
        issues: issues as any,
        suggestions,
        altTextGenerated
      });

      toast({
        title: "Analysis complete",
        description: `Accessibility score: ${score}/100`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Content Accessibility Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered accessibility analysis and alt-text generation
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content to Analyze</label>
              <Textarea
                placeholder="Paste your content here (HTML, markdown, or plain text)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background"
              />
            </div>

            <Button 
              onClick={analyzeContent} 
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-primary to-accent"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Accessibility
                </>
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Accessibility Score</h2>
                <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    result.score >= 80 ? 'bg-green-600' : 
                    result.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </Card>

            {result.issues.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Issues Found</h3>
                <div className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2 p-3 rounded-lg bg-muted/50">
                      {getIssueIcon(issue.type)}
                      <span className="flex-1">{issue.message}</span>
                      <Badge variant={issue.type === 'error' ? 'destructive' : 'secondary'}>
                        {issue.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {result.altTextGenerated && (
              <Card className="p-6 border-primary/50">
                <h3 className="text-xl font-bold mb-4">AI-Generated Alt Text</h3>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <code className="text-sm">{result.altTextGenerated}</code>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzer;
