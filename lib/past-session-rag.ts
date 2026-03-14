import { StoredBrief } from './briefs-client';

/**
 * Lightweight fast pattern matching from past briefs
 * Uses simple TF-IDF cosine similarity without heavy tokenization
 * Returns top 1-2 relevant briefs based on pattern/intention matching
 */

interface PatternMatch {
  briefId: string;
  score: number;
  snippet: string; // First 300 chars of brief
}

/**
 * Extract key words from text (simple stop-word filtering)
 */
function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'was',
    'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'if', 'as', 'from',
    'with', 'by', 'about', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its',
    'session', 'axis', 'protocol', 'brief', 'challenge', 'level', 'mode'
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word))
    .slice(0, 50); // Limit to prevent expensive computation
}

/**
 * Calculate simple cosine similarity between two keyword sets
 */
function cosineSimilarity(keywords1: string[], keywords2: string[]): number {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);

  const intersection = [...set1].filter(kw => set2.has(kw)).length;
  if (intersection === 0) return 0;

  const denominator = Math.sqrt(set1.size * set2.size);
  return intersection / denominator;
}

/**
 * Search past briefs for relevant patterns
 * FAST: Uses simple keyword matching, O(n) scan, no heavy NLP
 * Returns top 1-2 briefs only
 */
export function searchPastBriefs(
  currentInput: string,
  currentIntention: string,
  pastBriefs: StoredBrief[]
): PatternMatch[] {
  if (pastBriefs.length === 0) return [];

  const inputKeywords = extractKeywords(`${currentInput} ${currentIntention}`);
  if (inputKeywords.length === 0) return [];

  // Score each past brief
  const scores = pastBriefs.map(brief => {
    const briefText = `${brief.config.intention} ${brief.brief}`;
    const briefKeywords = extractKeywords(briefText);
    const score = cosineSimilarity(inputKeywords, briefKeywords);

    return {
      briefId: brief.id,
      score,
      snippet: brief.brief.slice(0, 300),
      createdAt: brief.createdAt,
    };
  });

  // Return top 2 only (limit context)
  return scores
    .filter(s => s.score > 0.1) // Threshold: avoid noise
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ briefId, score, snippet }) => ({ briefId, score, snippet }));
}

/**
 * Format past brief matches for injection into system prompt
 */
export function buildPastSessionContext(matches: PatternMatch[]): string {
  if (matches.length === 0) return '';

  const formattedMatches = matches
    .map((match, i) => `**Reference Pattern ${i + 1}:**\n${match.snippet}...`)
    .join('\n\n');

  return `## Similar Pattern(s) from Past Sessions
${formattedMatches}

Use these patterns as additional context if relevant to the current conversation.`;
}
