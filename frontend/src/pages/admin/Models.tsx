import { useCatalogModels, useSetModelStatus } from "@/hooks/use-platform";
import type { ICatalogModel } from "@/services/platform.service";

/**
 * AI model catalog (super-admin). Per ADR-003 a model is DATA, not code:
 * promoting canary → stable, or deprecating a model, changes what every
 * mobile device is offered by GET /api/mobile/models — with no app release.
 */

const STATUSES: ICatalogModel["status"][] = ["canary", "stable", "deprecated"];

const formatBytes = (b: number) =>
  b >= 1024 ** 3 ? `${(b / 1024 ** 3).toFixed(1)} GB` : `${Math.round(b / 1024 ** 2)} MB`;

export default function AdminModels() {
  const { data: models, isLoading, isError } = useCatalogModels();
  const setStatus = useSetModelStatus();

  if (isLoading) {
    return <p className="text-body-lg text-sjcs-on-surface-variant">Loading model catalog…</p>;
  }

  if (isError || !models) {
    return (
      <div className="shadow-ambient rounded-xl bg-sjcs-error-container p-6">
        <p className="font-medium text-sjcs-on-error-container">
          Couldn't load the model catalog — super-admin access is required.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <p className="text-label-md text-sjcs-primary">Platform</p>
        <h1 className="text-display-lg mt-2 text-sjcs-on-surface">AI Models</h1>
        <p className="text-body-lg mt-2 max-w-2xl text-sjcs-on-surface-variant">
          The catalog served to every device. Changing a model's status rolls it out or pulls it
          back immediately — no app release required.
        </p>
      </header>

      {models.length === 0 ? (
        <div className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-10 text-center">
          <p className="text-body-lg text-sjcs-on-surface-variant">No models in the catalog.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {models.map((m) => (
            <div key={m._id} className="shadow-ambient rounded-xl bg-sjcs-surface-container-lowest p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-title-lg text-sjcs-on-surface">{m.displayName}</h2>
                  <p className="mt-1 text-sm text-sjcs-on-surface-variant">
                    {m.modelId} · v{m.version} · {m.engine} · {m.task}
                  </p>
                  <p className="mt-1 text-sm text-sjcs-on-surface-variant">
                    {formatBytes(m.sizeBytes)} · {m.quantization} · needs {m.minimumRAMGB} GB RAM ·{" "}
                    {m.languages.join(", ")}
                  </p>
                </div>

                {/* Status control — the ADR-003 "data operation" */}
                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus.mutate({ modelId: m._id, status: s })}
                      disabled={setStatus.isPending || m.status === s}
                      className={`text-label-md rounded-xl px-4 py-2 capitalize transition-smooth disabled:cursor-default ${
                        m.status === s
                          ? "leadership-gradient text-white"
                          : "bg-sjcs-surface-container-highest text-sjcs-on-surface hover:opacity-80"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {m.status === "deprecated" && (
                <p className="mt-4 rounded-xl bg-sjcs-surface-container-low p-3 text-sm text-sjcs-on-surface-variant">
                  Deprecated — devices are warned, new installs are blocked.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
