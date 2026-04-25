import { useMemo, useState } from "react";

function buildSummary(params: {
  area: string;
  shift: string;
  incidents: string;
  priority: string;
  blocked: string;
  nextAction: string;
}) {
  const incidentCount = Number(params.incidents) || 0;

  let status = "Operación estable";

  if (params.priority === "Alta" || params.blocked === "Sí") {
    status = "Atención requerida";
  } else if (incidentCount >= 3) {
    status = "Seguimiento recomendado";
  }

  const summary = `Turno: ${params.shift}
Área: ${params.area}
Estado general: ${status}

Resumen:
Durante el turno ${params.shift.toLowerCase()} en el área de ${params.area.toLowerCase()}, se registraron ${incidentCount} incidencia${
    incidentCount === 1 ? "" : "s"
  }. La prioridad general del turno fue ${params.priority.toLowerCase()}.${
    params.blocked === "Sí"
      ? " Se detectó al menos un bloqueo activo que requiere seguimiento."
      : " No se reportaron bloqueos activos."
  } Siguiente acción: ${params.nextAction}.`;

  return { status, summary };
}

function getStatusClasses(status: string) {
  if (status === "Operación estable") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "Seguimiento recomendado") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-rose-100 text-rose-800";
}

export default function App() {
  const [area, setArea] = useState("Farmacia");
  const [shift, setShift] = useState("Matutino");
  const [incidents, setIncidents] = useState("1");
  const [priority, setPriority] = useState("Media");
  const [blocked, setBlocked] = useState("No");
  const [nextAction, setNextAction] = useState("Continuar monitoreo del siguiente turno");

  const result = useMemo(() => {
    return buildSummary({
      area,
      shift,
      incidents,
      priority,
      blocked,
      nextAction,
    });
  }, [area, shift, incidents, priority, blocked, nextAction]);

  async function copySummary() {
    await navigator.clipboard.writeText(result.summary);
  }

  function resetForm() {
    setArea("Farmacia");
    setShift("Matutino");
    setIncidents("1");
    setPriority("Media");
    setBlocked("No");
    setNextAction("Continuar monitoreo del siguiente turno");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Internal Reporting Tool
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">ShiftNote</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Generador de resumen operativo para entregar notas de turno de forma clara,
            rápida y consistente.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold">Datos del turno</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Área</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option>Farmacia</option>
                  <option>Sistemas</option>
                  <option>Compras</option>
                  <option>Atención al cliente</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Turno</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option>Matutino</option>
                  <option>Vespertino</option>
                  <option>Nocturno</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Número de incidencias</label>
                <input
                  type="number"
                  value={incidents}
                  onChange={(e) => setIncidents(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Prioridad general</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">¿Hay bloqueos activos?</label>
                <select
                  value={blocked}
                  onChange={(e) => setBlocked(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Siguiente acción</label>
                <textarea
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={copySummary}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Copiar resumen
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Vista previa</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Resumen listo para compartir con el siguiente turno.
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                  result.status
                )}`}
              >
                {result.status}
              </span>
            </div>

            <pre className="mt-6 whitespace-pre-wrap rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {result.summary}
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}
