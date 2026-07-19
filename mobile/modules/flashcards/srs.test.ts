import { review, INITIAL_SRS, MIN_EASE, type SrsState } from "./srs";

/**
 * The SM-2 scheduler decides whether a student actually retains material, and
 * it fails silently if wrong (cards just quietly stop showing up). Pure logic,
 * so it's cheap to pin down.
 */

const NOW = new Date("2026-01-01T09:00:00Z");
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86_400_000);

describe("SM-2 scheduling", () => {
  it("schedules a brand-new card 1 day out on the first good review", () => {
    const r = review(INITIAL_SRS, "good", NOW);
    expect(r.repetitions).toBe(1);
    expect(r.intervalDays).toBe(1);
    expect(daysBetween(NOW, r.dueAt)).toBe(1);
  });

  it("uses the classic 1 → 6 day ladder for the first two reviews", () => {
    const first = review(INITIAL_SRS, "good", NOW);
    const second = review(first, "good", NOW);
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);
  });

  it("multiplies by the ease factor from the third review onward", () => {
    let s: SrsState = INITIAL_SRS;
    s = review(s, "good", NOW); // 1
    s = review(s, "good", NOW); // 6
    const third = review(s, "good", NOW);
    // 6 * ease (~2.5) → ~15 days
    expect(third.intervalDays).toBe(Math.round(6 * s.ease));
    expect(third.intervalDays).toBeGreaterThan(6);
  });

  it("resets the ladder and re-shows the card on a lapse", () => {
    let s: SrsState = INITIAL_SRS;
    s = review(s, "good", NOW);
    s = review(s, "good", NOW);
    expect(s.repetitions).toBe(2);

    const lapsed = review(s, "again", NOW);
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.intervalDays).toBe(0);
    // Comes back within the session, not tomorrow.
    expect(lapsed.dueAt.getTime()).toBeGreaterThan(NOW.getTime());
    expect(lapsed.dueAt.getTime()).toBeLessThan(NOW.getTime() + 3600_000);
  });

  it("lowers ease on a lapse and raises it on an easy review", () => {
    const lapsed = review(INITIAL_SRS, "again", NOW);
    expect(lapsed.ease).toBeLessThan(INITIAL_SRS.ease);

    const easy = review(INITIAL_SRS, "easy", NOW);
    expect(easy.ease).toBeGreaterThan(INITIAL_SRS.ease);
  });

  it("never lets ease fall below the floor, however many lapses", () => {
    let s: SrsState = INITIAL_SRS;
    for (let i = 0; i < 50; i++) s = review(s, "again", NOW);
    expect(s.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it("gives 'easy' a longer interval than 'good' at the same point", () => {
    let base: SrsState = INITIAL_SRS;
    base = review(base, "good", NOW);
    base = review(base, "good", NOW);

    const good = review(base, "good", NOW);
    const easy = review(base, "easy", NOW);
    expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
  });

  it("makes 'hard' advance the card but more slowly than 'good'", () => {
    let base: SrsState = INITIAL_SRS;
    base = review(base, "good", NOW);
    base = review(base, "good", NOW);

    const hard = review(base, "hard", NOW);
    const good = review(base, "good", NOW);
    // Hard still counts as a pass…
    expect(hard.repetitions).toBe(3);
    // …but erodes ease, so future intervals grow more slowly.
    expect(hard.ease).toBeLessThan(good.ease);
  });

  it("grows intervals monotonically across a long good streak", () => {
    let s: SrsState = INITIAL_SRS;
    const intervals: number[] = [];
    for (let i = 0; i < 6; i++) {
      const r = review(s, "good", NOW);
      intervals.push(r.intervalDays);
      s = r;
    }
    for (let i = 1; i < intervals.length; i++) {
      expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
    }
  });
});
