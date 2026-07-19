import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  useMyChildren,
  useCurrentAcademicYear,
  useChildResults,
  useCreateAppeal,
} from "@/hooks/use-parent";
import type { IMarkResult } from "@/services/results.service";

const TERMS = ["Term 1", "Term 2", "Term 3"];

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-label-md rounded-xl px-4 py-2 transition-smooth ${
        active
          ? "leadership-gradient text-white"
          : "bg-sjcs-surface-container text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function AppealDialog({
  mark,
  onClose,
}: {
  mark: IMarkResult;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const appeal = useCreateAppeal();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 4) return;
    appeal.mutate(
      { markId: mark._id, reason: reason.trim() },
      { onSuccess: () => setTimeout(onClose, 1200) }
    );
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-sjcs-on-surface/40 p-6">
      <div className="glass shadow-ambient w-full max-w-md rounded-xl bg-card p-8">
        <h3 className="text-headline-md text-foreground">Request a review</h3>
        <p className="text-body-lg mt-2 text-muted-foreground">
          Tell us why this result should be reviewed. The subject teacher will respond, and any
          mark change must be countersigned by the director.
        </p>

        {appeal.isSuccess ? (
          <p className="mt-6 rounded-xl bg-sjcs-surface-container-low p-4 text-sm text-foreground">
            ✅ Your review request has been filed. You'll be notified of the outcome.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              minLength={4}
              required
              placeholder="e.g. The exam total appears to be added up incorrectly."
              className="w-full rounded-xl bg-sjcs-surface-container-low px-4 py-3 text-foreground outline-none transition-smooth focus:ring-2 focus:ring-sjcs-secondary"
            />
            {appeal.isError && (
              <p className="text-sm text-destructive">
                Couldn't file the request. There may already be an open appeal for this result.
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={appeal.isPending}
                className="leadership-gradient text-label-md flex-1 rounded-xl py-3 text-white transition-smooth hover:opacity-90 disabled:opacity-60"
              >
                {appeal.isPending ? "Sending…" : "Submit request"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-label-md rounded-xl bg-sjcs-surface-container px-5 py-3 text-foreground transition-smooth"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ResultsPanel({
  studentId,
  academicYearId,
  term,
}: {
  studentId: string;
  academicYearId: string;
  term: string;
}) {
  const { data, isLoading, notPublished, isError } = useChildResults(studentId, academicYearId, term);
  const [appealing, setAppealing] = useState<IMarkResult | null>(null);

  if (isLoading) {
    return <p className="text-body-lg text-muted-foreground">Loading results…</p>;
  }

  // The embargo is normal, expected behaviour — say so honestly (§33).
  if (notPublished) {
    return (
      <div className="shadow-ambient rounded-xl bg-card p-8 text-center">
        <p className="text-headline-md text-foreground">Results aren't published yet</p>
        <p className="text-body-lg mx-auto mt-2 max-w-md text-muted-foreground">
          {term} results for this student haven't been released by the school. You'll be
          notified the moment they're official — they'll appear here automatically.
        </p>
      </div>
    );
  }

  if (isError) {
    return <p className="text-body-lg text-destructive">Couldn't load results. Please try again.</p>;
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="shadow-ambient rounded-xl bg-card p-8 text-center">
        <p className="text-body-lg text-muted-foreground">
          No results recorded for {term} yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-label-md mb-4 text-muted-foreground">
        Released {new Date(data.releasedAt).toLocaleDateString()}
      </p>

      <div className="grid gap-4">
        {data.results.map((mark) => {
          const pct = Math.round((mark.total / mark.maxTotal) * 100);
          return (
            <div key={mark._id} className="shadow-ambient rounded-xl bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-title-lg text-foreground">
                    {mark.total}
                    <span className="text-muted-foreground"> / {mark.maxTotal}</span>
                  </p>
                  <p className="text-label-md mt-1 text-muted-foreground">
                    {term} · Grade {mark.grade} · {pct}%
                  </p>
                </div>
                <button
                  onClick={() => setAppealing(mark)}
                  className="text-label-md rounded-xl bg-sjcs-surface-container px-4 py-2 text-foreground transition-smooth hover:bg-sjcs-surface-container-high"
                >
                  Request review
                </button>
              </div>

              <div className="mt-5 grid gap-2">
                {mark.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {appealing && <AppealDialog mark={appealing} onClose={() => setAppealing(null)} />}
    </>
  );
}

export default function ParentPortal() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: children, isLoading: childrenLoading } = useMyChildren();
  const { data: year } = useCurrentAcademicYear();

  const [pickedChildId, setPickedChildId] = useState<string | null>(null);
  const [term, setTerm] = useState(TERMS[0]);

  // Derive the active child rather than syncing state in an effect: default to
  // the first child until the parent explicitly picks another.
  const childId = pickedChildId ?? children?.[0]?._id ?? null;
  const selected = children?.find((c) => c._id === childId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label-md text-sjcs-primary">Parent Portal</p>
          <h1 className="text-display-lg mt-2 text-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
        </div>
        <button
          onClick={logout}
          className="text-label-md rounded-xl bg-sjcs-surface-container px-4 py-2 text-foreground transition-smooth"
        >
          Sign out
        </button>
      </header>

      {childrenLoading ? (
        <p className="text-body-lg mt-12 text-muted-foreground">Loading your children…</p>
      ) : !children?.length ? (
        <div className="shadow-ambient mt-12 rounded-xl bg-card p-8 text-center">
          <p className="text-headline-md text-foreground">No children linked yet</p>
          <p className="text-body-lg mx-auto mt-2 max-w-md text-muted-foreground">
            Once your child is enrolled, they'll appear here and you'll be able to view their
            results as soon as the school publishes them.
          </p>
        </div>
      ) : (
        <>
          {/* Child switcher — supports multi-child families (§32) */}
          <section className="mt-10">
            <p className="text-label-md mb-3 text-muted-foreground">Children</p>
            <div className="flex flex-wrap gap-2">
              {children.map((c) => (
                <Pill key={c._id} active={c._id === childId} onClick={() => setPickedChildId(c._id)}>
                  {c.fullName}
                  {c.grade ? ` · G${c.grade}` : ""}
                </Pill>
              ))}
            </div>
          </section>

          {selected && (
            <section className="mt-10">
              <div className="shadow-ambient rounded-xl bg-card p-6">
                <p className="text-label-md text-muted-foreground">Student</p>
                <p className="text-title-lg mt-1 text-foreground">{selected.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.admissionNo ? `Admission No ${selected.admissionNo}` : selected.studentId}
                  {selected.grade ? ` · Grade ${selected.grade}` : ""}
                </p>
              </div>
            </section>
          )}

          <section className="mt-10">
            <p className="text-label-md mb-3 text-muted-foreground">Term</p>
            <div className="flex flex-wrap gap-2">
              {TERMS.map((t) => (
                <Pill key={t} active={t === term} onClick={() => setTerm(t)}>
                  {t}
                </Pill>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-headline-md mb-5 text-foreground">Report card</h2>
            {!year ? (
              <p className="text-body-lg text-muted-foreground">
                No active academic year has been set up by the school yet.
              </p>
            ) : childId ? (
              <ResultsPanel studentId={childId} academicYearId={year._id} term={term} />
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
