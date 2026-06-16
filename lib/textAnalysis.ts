import type { YouTubeComment } from "@/types/youtube";

// ── Stopwords ──────────────────────────────────────────────
const KO_STOPWORDS = new Set([
  "이", "그", "저", "것", "수", "들", "및", "등", "때", "년", "월", "일",
  "의", "을", "를", "가", "은", "는", "에", "도", "로", "으로", "와", "과",
  "하", "한", "하는", "하고", "하여", "해서", "에서", "있는", "있다", "없는",
  "없다", "되는", "되다", "됩니다", "입니다", "습니다", "했다", "했습니다",
  "했어요", "해요", "인데", "인지", "라고", "라는", "부터", "까지", "에게",
  "이나", "이며", "이고", "더", "또", "제", "내", "네", "나는", "저는",
  "우리", "그냥", "정말", "너무", "진짜", "아직", "이제", "여기", "거기",
  "뭔가", "어떤", "그런", "이런", "저런", "모든", "다른", "같은", "좋은",
  "다", "안", "못", "잘", "그리고", "하지만", "그런데", "그러나", "그래서",
  "따라서", "그래", "근데", "어", "아", "오", "음", "음악", "영상", "채널",
  "유튜브", "영상에서", "통해",
]);

const EN_STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "in", "on", "at", "by", "for", "with",
  "about", "as", "into", "of", "to", "from", "up", "and", "or", "but",
  "not", "no", "this", "that", "these", "those", "i", "me", "my", "we",
  "you", "your", "he", "she", "it", "they", "them", "what", "who",
]);

// ── Types ──────────────────────────────────────────────────
export interface FreqItem {
  word: string;
  count: number;
}

export interface StrFreqItem {
  item: string;
  count: number;
}

export interface SentimentResult {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

// ── Core utils ─────────────────────────────────────────────
export function normalizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")           // strip HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/https?:\/\/\S+/g, " ")    // strip URLs
    .replace(/[^\p{L}\p{N}\s]/gu, " ")  // keep letters & numbers
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function isValidWord(word: string, minLen: number): boolean {
  if (word.length < minLen) return false;
  if (/^\d+$/.test(word)) return false;
  if (KO_STOPWORDS.has(word)) return false;
  if (EN_STOPWORDS.has(word)) return false;
  return true;
}

// ── Exported functions ─────────────────────────────────────

/** 텍스트 배열에서 불용어 제거 후 단어 빈도 TOP N 반환 */
export function extractKeywords(
  texts: string[],
  options: { limit?: number; minLen?: number } = {}
): FreqItem[] {
  const { limit = 10, minLen = 2 } = options;
  const freq: Record<string, number> = {};

  for (const text of texts) {
    const words = normalizeText(text).split(/\s+/);
    for (const word of words) {
      if (!isValidWord(word, minLen)) continue;
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

/** 문자열 배열 빈도 집계 TOP N */
export function countFrequencies(items: string[], limit = 10): StrFreqItem[] {
  const freq: Record<string, number> = {};
  for (const item of items) {
    const t = item.trim();
    if (!t) continue;
    freq[t] = (freq[t] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item, count]) => ({ item, count }));
}

/** 질문형 댓글 수 계산 */
const QUESTION_WORDS = [
  "뭐", "왜", "어떻게", "언제", "어디", "누구", "가능", "알려", "추천",
  "어떤", "무슨", "알수있", "궁금",
];

export function analyzeQuestions(comments: YouTubeComment[]): number {
  return comments.filter((c) => {
    if (c.textDisplay.includes("?") || c.textDisplay.includes("？")) return true;
    const text = normalizeText(c.textDisplay);
    return QUESTION_WORDS.some((w) => text.includes(w));
  }).length;
}

/** 간단한 사전 기반 긍정/부정/중립 추정 */
const POSITIVE_WORDS = [
  "좋", "최고", "예쁘", "멋지", "감사", "도움", "유용", "추천", "사랑",
  "완벽", "훌륭", "대박", "짱", "행복", "기쁘", "재미", "굿", "최애",
  "awesome", "great", "love", "amazing", "nice", "good", "perfect",
  "beautiful", "wonderful", "excellent", "thanks",
];

const NEGATIVE_WORDS = [
  "별로", "싫", "문제", "아쉽", "최악", "실망", "불편", "어렵", "오류",
  "부족", "나쁘", "짜증", "힘들", "어이없", "불만", "후회", "망함",
  "bad", "worst", "terrible", "awful", "horrible", "hate", "poor",
  "disappointed", "useless",
];

export function analyzeSentiment(comments: YouTubeComment[]): SentimentResult {
  let positive = 0;
  let negative = 0;
  const total = comments.length;

  for (const c of comments) {
    const text = normalizeText(c.textDisplay);
    const isPos = POSITIVE_WORDS.some((w) => text.includes(w));
    const isNeg = NEGATIVE_WORDS.some((w) => text.includes(w));
    if (isPos && !isNeg) positive++;
    else if (isNeg && !isPos) negative++;
  }

  return { positive, negative, neutral: total - positive - negative, total };
}

/** 좋아요 많은 댓글 반환 */
export function getTopLikedComments(
  comments: YouTubeComment[],
  limit = 3
): YouTubeComment[] {
  return [...comments]
    .filter((c) => c.likeCount > 0)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}
