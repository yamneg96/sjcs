import { AIEngine } from "../ai/engine/ai.engine";
import { EduContext } from "../ai/types";
import { addCards } from "./flashcards.service";

/**
 * AI flashcard generation (§42). Goes through AIEngine like every other
 * feature — so it works on-device when a local model is installed, and via
 * cloud otherwise, with no model knowledge here (ADR-003).
 */

export interface GeneratedCard {
  front: string;
  back: string;
}

/**
 * Models are asked for JSON, but LLM output is never fully trusted: parse
 * defensively and fall back to a "Q:/A:" line scan before giving up.
 */
export function parseCards(raw: string): GeneratedCard[] {
  const text = (raw || "").trim();
  if (!text) return [];

  // Preferred: a JSON array, possibly wrapped in prose or a ```json fence.
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        const cards = parsed
          .map((c) => ({
            front: String(c?.front ?? c?.question ?? "").trim(),
            back: String(c?.back ?? c?.answer ?? "").trim(),
          }))
          .filter((c) => c.front && c.back);
        if (cards.length) return cards;
      }
    } catch {
      // fall through to the line scan
    }
  }

  // Fallback: "Q: … / A: …" pairs.
  const cards: GeneratedCard[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const q = lines[i].match(/^(?:Q|Question|Front)\s*[:.\-]\s*(.+)$/i);
    if (!q) continue;
    const a = lines[i + 1]?.match(/^(?:A|Answer|Back)\s*[:.\-]\s*(.+)$/i);
    if (a) {
      cards.push({ front: q[1].trim(), back: a[1].trim() });
      i++;
    }
  }
  return cards;
}

/**
 * Generates cards from source content (a lesson, notes, a topic) and stores
 * them in the deck. Returns how many were added.
 */
export async function generateIntoDeck(
  deckId: string,
  source: string,
  eduContext: EduContext = {},
  count = 8
): Promise<{ added: number; route: string }> {
  const prompt = [
    `Create ${count} flashcards from this content.`,
    "Respond with ONLY a JSON array like:",
    '[{"front":"question or term","back":"answer or definition"}]',
    "One idea per card. Keep the back short enough to recall.",
    "",
    "Content:",
    `"""${source.slice(0, 6000)}"""`,
  ].join("\n");

  const result = await AIEngine.flashcards(prompt, { eduContext });
  const cards = parseCards(result.text);

  if (!cards.length) {
    throw new Error(
      "I couldn't turn that into flashcards. Try again, or use content with clearer facts."
    );
  }

  const added = await addCards(deckId, cards);
  return { added, route: result.route };
}
