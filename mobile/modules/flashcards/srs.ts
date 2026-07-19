/**
 * Spaced repetition — an SM-2 derivative (§42), computed entirely on-device so
 * reviews work with zero connectivity.
 *
 * SM-2 in brief: each card carries an ease factor and an interval. A good
 * recall multiplies the interval by the ease; a lapse resets it. Ease drifts
 * with performance but never below 1.3, otherwise cards enter a death spiral.
 */

/** How well the student recalled the card. */
export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface SrsState {
  /** Consecutive successful reviews. */
  repetitions: number;
  /** Days until the next review. */
  intervalDays: number;
  /** SM-2 ease factor. */
  ease: number;
}

export const MIN_EASE = 1.3;

export const INITIAL_SRS: SrsState = {
  repetitions: 0,
  intervalDays: 0,
  ease: 2.5,
};

/** SM-2 quality score (0–5) for each button. */
const QUALITY: Record<ReviewGrade, number> = {
  again: 2,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface SrsResult extends SrsState {
  /** When this card is next due. */
  dueAt: Date;
}

/**
 * Applies a review to a card's SRS state and returns the next schedule.
 * `now` is injectable so the scheduling is testable.
 */
export function review(state: SrsState, grade: ReviewGrade, now: Date = new Date()): SrsResult {
  const q = QUALITY[grade];

  // A lapse (q < 3) restarts the ladder — the card comes back today.
  if (q < 3) {
    const ease = Math.max(MIN_EASE, state.ease - 0.2);
    return {
      repetitions: 0,
      intervalDays: 0,
      ease,
      dueAt: new Date(now.getTime() + 10 * 60 * 1000), // ~10 min later
    };
  }

  const repetitions = state.repetitions + 1;

  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(state.intervalDays * state.ease);

  // Standard SM-2 ease adjustment.
  const ease = Math.max(
    MIN_EASE,
    state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  // "Easy" earns a bonus step so well-known cards leave the rotation faster.
  if (grade === "easy") intervalDays = Math.round(intervalDays * 1.3);

  return {
    repetitions,
    intervalDays,
    ease,
    dueAt: new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000),
  };
}
