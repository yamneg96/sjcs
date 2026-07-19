import { usePlatformOrganizations, useSetOrgSuspended } from "@/hooks/use-platform";

/**
 * Organization lifecycle management (super-admin). Suspending an org is a
 * real, audited platform-scope action — the backend logs every change.
 */
export default function AdminOrganizations() {
  const { data: orgs, isLoading, isError } = usePlatformOrganizations();
  const setSuspended = useSetOrgSuspended();

  if (isLoading) {
    return <p className="text-body-lg text-sjcs-on-surface-variant">Loading organizations…</p>;
  }

  if (isError || !orgs) {
    return (
      <div className="shadow-ambient rounded-xl bg-sjcs-error-container p-6">
        <p className="font-medium text-sjcs-on-error-container">
          Couldn't load organizations — super-admin access is required.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <p className="text-label-md text-sjcs-primary">Platform</p>
        <h1 className="text-display-lg mt-2 text-sjcs-on-surface">Organizations</h1>
        <p className="text-body-lg mt-2 text-sjcs-on-surface-variant">
          {orgs.length} organization{orgs.length === 1 ? "" : "s"} on the platform.
        </p>
      </header>

      {orgs.length === 0 ? (
        <div className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-10 text-center">
          <p className="text-body-lg text-sjcs-on-surface-variant">No organizations yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orgs.map((org) => {
            const suspended = !!org.suspendedAt;
            return (
              <div
                key={org._id}
                className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-title-lg text-sjcs-on-surface">{org.name}</h2>
                      <span
                        className={`text-label-md rounded-full px-3 py-1 ${
                          suspended
                            ? "bg-sjcs-error-container text-sjcs-on-error-container"
                            : "bg-sjcs-surface-container-high text-sjcs-on-surface"
                        }`}
                      >
                        {suspended ? "Suspended" : org.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-sjcs-on-surface-variant">
                      /{org.slug} · {org.plan} plan · joined{" "}
                      {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSuspended.mutate({ orgId: org._id, suspended: !suspended })
                    }
                    disabled={setSuspended.isPending}
                    className={`text-label-md rounded-xl px-5 py-2.5 transition-smooth disabled:opacity-60 ${
                      suspended
                        ? "leadership-gradient text-white"
                        : "bg-sjcs-surface-container-highest text-sjcs-on-surface"
                    }`}
                  >
                    {suspended ? "Reactivate" : "Suspend"}
                  </button>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <dt className="text-label-md text-sjcs-on-surface-variant">Students</dt>
                    <dd className="text-title-lg mt-1 text-sjcs-on-surface">{org.studentCount}</dd>
                  </div>
                  <div>
                    <dt className="text-label-md text-sjcs-on-surface-variant">Staff</dt>
                    <dd className="text-title-lg mt-1 text-sjcs-on-surface">{org.staffCount}</dd>
                  </div>
                  <div>
                    <dt className="text-label-md text-sjcs-on-surface-variant">AI spend</dt>
                    <dd className="text-title-lg mt-1 text-sjcs-on-surface">
                      ${org.aiUsage.toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-label-md text-sjcs-on-surface-variant">AI budget</dt>
                    <dd className="text-title-lg mt-1 text-sjcs-on-surface">
                      ${org.aiLimit.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
