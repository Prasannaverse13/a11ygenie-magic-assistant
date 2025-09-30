// Gemini AI Service for accessibility analysis
const GEMINI_API_KEY = "AIzaSyDww9VGW3Oo8qKZ4FvBxHZQ1fR7N0sJm8k"; // Replace with your actual key

export interface GeminiAnalysisResult {
  score: number;
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
  }>;
  suggestions: string[];
  altText?: string;
}

export async function analyzeContentWithGemini(
  content: string,
  imageUrl?: string
): Promise<GeminiAnalysisResult> {
  const prompt = imageUrl
    ? `Analyze this content and image for accessibility issues. Content: "${content}". Image URL: ${imageUrl}. 
       Provide: 1) accessibility score (0-100), 2) list of issues (type: error/warning/info, message), 
       3) suggestions for improvement, 4) generate descriptive alt text for the image.
       Return as JSON: { "score": number, "issues": [{"type": string, "message": string}], "suggestions": [string], "altText": string }`
    : `Analyze this content for accessibility issues: "${content}". 
       Provide: 1) accessibility score (0-100), 2) list of issues (type: error/warning/info, message), 
       3) suggestions for improvement.
       Return as JSON: { "score": number, "issues": [{"type": string, "message": string}], "suggestions": [string] }`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini API");
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback parsing if JSON not found
    return {
      score: 75,
      issues: [{ type: "info", message: "Analysis completed" }],
      suggestions: [text],
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

export async function generateAISummary(content: string): Promise<string> {
  const prompt = `Provide a concise 2-sentence summary of this content focusing on its accessibility features: "${content}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}
