import { usePlatformStats } from "@/hooks/use-platform";

/**
 * Platform dashboard (super-admin). Every figure comes from
 * GET /api/platform/stats — a cross-tenant, SUPER_ADMIN-only aggregate.
 */

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-6">
      <p className="text-label-md text-sjcs-on-surface-variant">{label}</p>
      <p className="text-display-lg mt-2 leading-none text-sjcs-on-surface">{value}</p>
      {hint && <p className="mt-2 text-sm text-sjcs-on-surface-variant">{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading, isError } = usePlatformStats();

  if (isLoading) {
    return <p className="text-body-lg text-sjcs-on-surface-variant">Loading platform stats…</p>;
  }

  if (isError || !stats) {
    return (
      <div className="shadow-ambient rounded-xl bg-sjcs-error-container p-6">
        <p className="font-medium text-sjcs-on-error-container">
          Couldn't load platform stats — super-admin access is required.
        </p>
      </div>
    );
  }

  const aiPct = stats.aiBudgetUSD > 0 ? Math.round((stats.aiSpendUSD / stats.aiBudgetUSD) * 100) : 0;

  return (
    <div>
      <header className="mb-10">
        <p className="text-label-md text-sjcs-primary">Platform</p>
        <h1 className="text-display-lg mt-2 text-sjcs-on-surface">Overview</h1>
        <p className="text-body-lg mt-2 text-sjcs-on-surface-variant">
          Live figures across every organization on Lumora.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Organizations" value={stats.organizations} hint={`${stats.activeOrgs} active`} />
        <Stat label="Students" value={stats.students.toLocaleString()} />
        <Stat label="Teachers" value={stats.teachers} />
        <Stat label="Parents" value={stats.parents} />
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2">
        <Stat
          label="Admissions"
          value={stats.admissions}
          hint={`${stats.pendingAdmissions} awaiting review`}
        />
        <div className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-6">
          <p className="text-label-md text-sjcs-on-surface-variant">AI spend (this month)</p>
          <p className="text-display-lg mt-2 leading-none text-sjcs-on-surface">
            ${stats.aiSpendUSD.toFixed(2)}
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sjcs-surface-container-high">
            <div
              className="leadership-gradient h-full rounded-full"
              style={{ width: `${Math.min(aiPct, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-sjcs-on-surface-variant">
            {aiPct}% of ${stats.aiBudgetUSD.toFixed(2)} budget
          </p>
        </div>
      </section>
    </div>
  );
}
