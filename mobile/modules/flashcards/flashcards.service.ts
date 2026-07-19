import * as SQLite from "expo-sqlite";
import { INITIAL_SRS, review, type ReviewGrade, type SrsState } from "./srs";

/**
 * Flashcard storage (§42, §46) — SQLite on the device. Decks, cards and the
 * whole SM-2 schedule live here, so review sessions work fully offline; nothing
 * about studying requires the network.
 */

export interface Deck {
  id: string;
  title: string;
  subject?: string;
  createdAt: string;
  /** Populated by listDecks(). */
  cardCount?: number;
  dueCount?: number;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  repetitions: number;
  intervalDays: number;
  ease: number;
  dueAt: string;
  createdAt: string;
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("lumora-flashcards.db");
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS decks (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          subject TEXT,
          createdAt TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS cards (
          id TEXT PRIMARY KEY NOT NULL,
          deckId TEXT NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          repetitions INTEGER NOT NULL DEFAULT 0,
          intervalDays INTEGER NOT NULL DEFAULT 0,
          ease REAL NOT NULL DEFAULT 2.5,
          dueAt TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_cards_due ON cards (deckId, dueAt);
      `);
      return db;
    })();
  }
  return dbPromise;
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export async function createDeck(title: string, subject?: string): Promise<Deck> {
  const db = await getDb();
  const deck: Deck = { id: uid(), title, subject, createdAt: new Date().toISOString() };
  await db.runAsync(
    "INSERT INTO decks (id, title, subject, createdAt) VALUES (?, ?, ?, ?)",
    deck.id,
    deck.title,
    deck.subject ?? null,
    deck.createdAt
  );
  return deck;
}

/** Decks with their card totals and how many are due right now. */
export async function listDecks(): Promise<Deck[]> {
  const db = await getDb();
  return db.getAllAsync<Deck>(
    `SELECT d.*,
            (SELECT COUNT(*) FROM cards c WHERE c.deckId = d.id) AS cardCount,
            (SELECT COUNT(*) FROM cards c WHERE c.deckId = d.id AND c.dueAt <= ?) AS dueCount
     FROM decks d
     ORDER BY d.createdAt DESC`,
    new Date().toISOString()
  );
}

export async function deleteDeck(deckId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM cards WHERE deckId = ?", deckId);
  await db.runAsync("DELETE FROM decks WHERE id = ?", deckId);
}

export async function addCards(
  deckId: string,
  cards: { front: string; back: string }[]
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();
  let added = 0;

  await db.withTransactionAsync(async () => {
    for (const c of cards) {
      if (!c.front?.trim() || !c.back?.trim()) continue;
      await db.runAsync(
        `INSERT INTO cards (id, deckId, front, back, repetitions, intervalDays, ease, dueAt, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        uid(),
        deckId,
        c.front.trim(),
        c.back.trim(),
        INITIAL_SRS.repetitions,
        INITIAL_SRS.intervalDays,
        INITIAL_SRS.ease,
        now, // brand-new cards are due immediately
        now
      );
      added++;
    }
  });
  return added;
}

/** Cards due for review in a deck, oldest-due first. */
export async function getDueCards(deckId: string, limit = 50): Promise<Card[]> {
  const db = await getDb();
  return db.getAllAsync<Card>(
    "SELECT * FROM cards WHERE deckId = ? AND dueAt <= ? ORDER BY dueAt ASC LIMIT ?",
    deckId,
    new Date().toISOString(),
    limit
  );
}

export async function getDeckCards(deckId: string): Promise<Card[]> {
  const db = await getDb();
  return db.getAllAsync<Card>(
    "SELECT * FROM cards WHERE deckId = ? ORDER BY createdAt DESC",
    deckId
  );
}

/** Applies an SM-2 review and persists the new schedule. */
export async function reviewCard(card: Card, grade: ReviewGrade): Promise<Card> {
  const db = await getDb();
  const state: SrsState = {
    repetitions: card.repetitions,
    intervalDays: card.intervalDays,
    ease: card.ease,
  };
  const next = review(state, grade);

  await db.runAsync(
    "UPDATE cards SET repetitions = ?, intervalDays = ?, ease = ?, dueAt = ? WHERE id = ?",
    next.repetitions,
    next.intervalDays,
    next.ease,
    next.dueAt.toISOString(),
    card.id
  );

  return {
    ...card,
    repetitions: next.repetitions,
    intervalDays: next.intervalDays,
    ease: next.ease,
    dueAt: next.dueAt.toISOString(),
  };
}
