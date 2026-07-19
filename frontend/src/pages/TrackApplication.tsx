import { useState } from "react";
import { useTrackApplication } from "@/hooks/use-admissions";
import type { ApplicationTracking } from "@/services/admissions.service";
import type { AdmissionStatus } from "@/types/api.types";

// The org slug for the public site (matches Apply.tsx).
const ORG_SLUG = "sjcs";

/** Ordered pipeline shown to applicants (§30 admissions pipeline). */
const STAGES: { key: AdmissionStatus; label: string }[] = [
  { key: "PENDING_REVIEW", label: "Under Review" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { key: "APPROVED", label: "Approved" },
];

const STATUS_COPY: Record<AdmissionStatus, { title: string; body: string; tone: string }> = {
  INQUIRY: {
    title: "Inquiry received",
    body: "We have your inquiry. Complete your application to move forward.",
    tone: "text-sjcs-secondary",
  },
  PENDING_REVIEW: {
    title: "Under review",
    body: "Our admissions team is reviewing the application. We'll be in touch soon.",
    tone: "text-sjcs-secondary",
  },
  INTERVIEW_SCHEDULED: {
    title: "Interview scheduled",
    body: "An interview has been scheduled. Please arrive 15 minutes early with original documents.",
    tone: "text-sjcs-secondary",
  },
  APPROVED: {
    title: "Approved — welcome!",
    body: "Congratulations! Enrollment instructions have been sent to your email.",
    tone: "text-sjcs-tertiary",
  },
  WAITLISTED: {
    title: "Waitlisted",
    body: "The application is on our waiting list. We'll notify you if a place opens up.",
    tone: "text-sjcs-secondary",
  },
  REJECTED: {
    title: "Decision issued",
    body: "Unfortunately we are unable to offer a place at this time. You're welcome to reapply next cycle.",
    tone: "text-destructive",
  },
};

function StatusTimeline({ status }: { status: AdmissionStatus }) {
  // Terminal states that sit outside the happy-path pipeline.
  if (status === "REJECTED" || status === "WAITLISTED") return null;

  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:gap-0">
      {STAGES.map((stage, i) => {
        const done = currentIndex >= i && currentIndex !== -1;
        return (
          <li key={stage.key} className="flex flex-1 items-center gap-3">
            <span
              aria-hidden
              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                done
                  ? "leadership-gradient text-white"
                  : "bg-sjcs-surface-container text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}
            >
              {stage.label}
            </span>
            {i < STAGES.length - 1 && (
              <span
                aria-hidden
                className={`hidden h-px flex-1 sm:block ${
                  currentIndex > i ? "bg-sjcs-primary" : "bg-sjcs-surface-container-high"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ResultCard({ data }: { data: ApplicationTracking }) {
  const copy = STATUS_COPY[data.status];

  return (
    <div className="shadow-ambient rounded-xl bg-card p-8">
      <p className="text-label-md text-muted-foreground">Application status</p>
      <h2 className={`text-headline-md mt-1 ${copy.tone}`}>{copy.title}</h2>
      <p className="text-body-lg mt-2 text-muted-foreground">{copy.body}</p>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-label-md text-muted-foreground">Applicant</dt>
          <dd className="mt-1 font-medium text-foreground">{data.studentName}</dd>
        </div>
        <div>
          <dt className="text-label-md text-muted-foreground">Grade applied for</dt>
          <dd className="mt-1 font-medium text-foreground">Grade {data.gradeAppliedFor}</dd>
        </div>
        <div>
          <dt className="text-label-md text-muted-foreground">Submitted</dt>
          <dd className="mt-1 font-medium text-foreground">
            {new Date(data.submittedAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      {data.status === "INTERVIEW_SCHEDULED" && data.interviewDate && (
        <div className="mt-6 rounded-xl bg-sjcs-surface-container-low p-4">
          <p className="text-label-md text-muted-foreground">Your interview</p>
          <p className="mt-1 font-medium text-foreground">
            {new Date(data.interviewDate).toLocaleDateString()}
            {data.interviewTime ? ` at ${data.interviewTime}` : ""}
          </p>
        </div>
      )}

      {data.enrolled && (
        <p className="mt-6 rounded-xl bg-sjcs-surface-container-low p-4 text-sm text-foreground">
          🎓 This student is now enrolled. Account activation details were sent to your email.
        </p>
      )}

      <div className="mt-8">
        <StatusTimeline status={data.status} />
      </div>
    </div>
  );
}

export default function TrackApplication() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const track = useTrackApplication();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) return;
    track.mutate({ orgSlug: ORG_SLUG, reference: reference.trim(), email: email.trim() });
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-label-md text-sjcs-primary">Admissions</p>
      <h1 className="text-display-lg mt-2 text-foreground">Track your application</h1>
      <p className="text-body-lg mt-4 max-w-xl text-muted-foreground">
        Enter the reference from your confirmation email along with the email address you
        applied with.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
        <div>
          <label htmlFor="reference" className="text-label-md text-muted-foreground">
            Application reference
          </label>
          <input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. 6a58dc0fb794f7ccf0ef9119"
            className="mt-2 w-full rounded-xl bg-sjcs-surface-container-low px-4 py-3 text-foreground outline-none transition-smooth focus:ring-2 focus:ring-sjcs-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="text-label-md text-muted-foreground">
            Email used to apply
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl bg-sjcs-surface-container-low px-4 py-3 text-foreground outline-none transition-smooth focus:ring-2 focus:ring-sjcs-secondary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={track.isPending}
          className="leadership-gradient text-label-md w-full rounded-xl py-4 text-white transition-smooth hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {track.isPending ? "Checking…" : "Check status"}
        </button>
      </form>

      {track.isError && (
        <div className="mt-8 rounded-xl bg-sjcs-error-container p-5">
          <p className="font-medium text-sjcs-on-error-container">
            We couldn't find an application with those details.
          </p>
          <p className="mt-1 text-sm text-sjcs-on-error-container/80">
            Double-check the reference and make sure you're using the same email you applied
            with.
          </p>
        </div>
      )}

      {track.data && (
        <div className="mt-10">
          <ResultCard data={track.data} />
        </div>
      )}
    </main>
  );
}
