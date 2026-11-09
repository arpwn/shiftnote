import { useState } from "react";
import {
  buildSummary,
  getStatus,
  isWorkspace,
  nextDraft,
  shifts,
  validateHandoff,
} from "./lib/handoff";
import type { Incident, Shift, ShiftDocument, Workspace } from "./lib/handoff";
const key = "shiftnote.workspace.v1";
const example: Workspace = {
  draft: {
    area: "Farmacia",
    shift: "Matutino",
    author: "",
    nextAction: "Confirmar el acceso a la terminal y validar el inventario.",
    incidents: [
      {
        id: "demo-1",
        title: "Restablecer acceso a terminal",
        owner: "Mesa de ayuda",
        priority: "Alta",
        status: "En curso",
        blocked: true,
      },
      {
        id: "demo-2",
        title: "Validar inventario de insumos",
        owner: "Turno entrante",
        priority: "Media",
        status: "Abierta",
        blocked: false,
      },
    ],
  },
  history: [],
};
function load(): Workspace {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) || "null");
    if (isWorkspace(data)) return data;
  } catch {
    /* Examples remain available without storage. */
  }
  return example;
}
const emptyIncident = {
  title: "",
  owner: "",
  priority: "Media" as Incident["priority"],
  blocked: false,
};
export default function App() {
  const [workspace, setWorkspace] = useState(load);
  const [newIncident, setNewIncident] = useState(emptyIncident);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const draft = workspace.draft;
  const pending = draft.incidents.filter((i) => i.status !== "Resuelta");
  const blocked = pending.filter((i) => i.blocked).length;
  const summary = buildSummary(draft);
  function persist(next: Workspace) {
    setWorkspace(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      return true;
    } catch {
      setNotice(
        "Cambios disponibles en esta sesión; el navegador no permitió guardarlos.",
      );
      return false;
    }
  }
  function updateDraft(patch: Partial<ShiftDocument>) {
    const saved = persist({ ...workspace, draft: { ...draft, ...patch } });
    setError("");
    return saved;
  }
  function updateIncident(id: string, patch: Partial<Incident>) {
    updateDraft({
      incidents: draft.incidents.map((i) =>
        i.id === id ? { ...i, ...patch } : i,
      ),
    });
  }
  function addIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newIncident.title.trim() || !newIncident.owner.trim()) {
      setError("Escribe la incidencia y su responsable.");
      return;
    }
    const saved = updateDraft({
      incidents: [
        ...draft.incidents,
        {
          ...newIncident,
          id: crypto.randomUUID(),
          title: newIncident.title.trim(),
          owner: newIncident.owner.trim(),
          status: "Abierta",
        },
      ],
    });
    setNewIncident(emptyIncident);
    if (saved) setNotice("Incidencia añadida al turno.");
  }
  function closeShift() {
    const issue = validateHandoff(draft);
    if (issue) {
      setError(issue);
      return;
    }
    const saved = persist({
      draft: nextDraft(draft),
      history: [
        {
          ...draft,
          id: crypto.randomUUID(),
          closedAt: new Date().toISOString(),
          incidents: draft.incidents.map((i) => ({ ...i })),
        },
        ...workspace.history,
      ],
    });
    if (saved)
      setNotice(
        `Turno cerrado. ${pending.length} ${pending.length === 1 ? "pendiente transferido" : "pendientes transferidos"} al turno ${nextDraft(draft).shift.toLowerCase()}.`,
      );
    setError("");
  }
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setNotice("Resumen copiado.");
    } catch {
      setNotice(
        "Selecciona y copia el resumen directamente del campo de texto.",
      );
    }
  }
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#main">
          <span>sn</span>ShiftNote
        </a>
        <span className="local-label">
          ESPACIO DE DEMOSTRACIÓN · GUARDADO LOCAL
        </span>
        <a
          href="https://github.com/arpwn/shiftnote"
          target="_blank"
          rel="noreferrer"
        >
          Código ↗
        </a>
      </header>
      <main id="main" className="container">
        <div className="heading">
          <div>
            <p className="eyebrow">CONTINUIDAD OPERATIVA</p>
            <h1>
              El turno cambia.
              <br />
              <span>El contexto se queda.</span>
            </h1>
            <p>
              Incidencias, responsables y próximos pasos para el equipo que
              sigue.
            </p>
          </div>
          <div
            className={`operation-state ${getStatus(draft.incidents) === "Atención requerida" ? "attention" : ""}`}
          >
            <span>●</span> {getStatus(draft.incidents)}
          </div>
        </div>
        <section className="shift-bar" aria-label="Datos del turno">
          <div>
            <label htmlFor="area">Área</label>
            <select
              id="area"
              value={draft.area}
              onChange={(e) => updateDraft({ area: e.target.value })}
            >
              {["Farmacia", "Sistemas", "Compras", "Atención al cliente"].map(
                (a) => (
                  <option key={a}>{a}</option>
                ),
              )}
            </select>
          </div>
          <div>
            <label htmlFor="shift">Turno</label>
            <select
              id="shift"
              value={draft.shift}
              onChange={(e) => updateDraft({ shift: e.target.value as Shift })}
            >
              {shifts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="author">Quién entrega</label>
            <input
              id="author"
              maxLength={80}
              placeholder="Tu nombre o equipo"
              value={draft.author}
              onChange={(e) => updateDraft({ author: e.target.value })}
            />
          </div>
          <div className="turn-metrics">
            <span>
              <strong>{pending.length}</strong> {pending.length === 1 ? "pendiente" : "pendientes"}
            </span>
            <span>
              <strong>{blocked}</strong> {blocked === 1 ? "bloqueo" : "bloqueos"}
            </span>
          </div>
        </section>
        <div className="workspace">
          <div>
            <section className="panel incidents-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">01 / SEGUIMIENTO</p>
                  <h2>Lo que necesita atención</h2>
                </div>
                <label className="sr-only" htmlFor="filter">
                  Filtrar incidencias
                </label>
                <select
                  id="filter"
                  className="compact-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {["Todas", "Abierta", "En curso", "Resuelta"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="muted">
                Empieza con dos incidencias de ejemplo. Edita sus responsables y
                estados o añade las tuyas.
              </p>
              <div className="incidents">
                {draft.incidents
                  .filter(
                    (i) =>
                      statusFilter === "Todas" || i.status === statusFilter,
                  )
                  .map((i) => (
                    <article
                      className={`incident ${i.status === "Resuelta" ? "resolved" : ""}`}
                      key={i.id}
                    >
                      <div className="incident-top">
                        <span
                          className={`priority ${i.priority.toLowerCase()}`}
                        >
                          {i.priority}
                        </span>
                        {i.blocked && i.status !== "Resuelta" && (
                          <span className="blocked-label">Bloqueada</span>
                        )}
                        <span className="incident-id">
                          #{draft.incidents.indexOf(i) + 1}
                        </span>
                      </div>
                      <h3>{i.title}</h3>
                      <div className="incident-fields">
                        <label>
                          Responsable
                          <input
                            aria-label={`Responsable de ${i.title}`}
                            maxLength={80}
                            value={i.owner}
                            onChange={(e) =>
                              updateIncident(i.id, { owner: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Estado
                          <select
                            aria-label={`Estado de ${i.title}`}
                            value={i.status}
                            onChange={(e) =>
                              updateIncident(i.id, {
                                status: e.target.value as Incident["status"],
                              })
                            }
                          >
                            {["Abierta", "En curso", "Resuelta"].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={i.blocked}
                          disabled={i.status === "Resuelta"}
                          onChange={(e) =>
                            updateIncident(i.id, { blocked: e.target.checked })
                          }
                        />{" "}
                        Tiene un bloqueo activo
                      </label>
                    </article>
                  ))}
                {!draft.incidents.some(
                  (i) => statusFilter === "Todas" || i.status === statusFilter,
                ) && (
                  <p className="empty">No hay incidencias en este estado.</p>
                )}
              </div>
              <details className="add-incident" open>
                <summary>＋ Añadir incidencia</summary>
                <form onSubmit={addIncident}>
                  <label htmlFor="incident-title">Qué pasó</label>
                  <input
                    id="incident-title"
                    value={newIncident.title}
                    maxLength={160}
                    placeholder="Describe la incidencia"
                    onChange={(e) =>
                      setNewIncident({ ...newIncident, title: e.target.value })
                    }
                  />
                  <div className="incident-fields">
                    <div>
                      <label htmlFor="incident-owner">Responsable</label>
                      <input
                        id="incident-owner"
                        maxLength={80}
                        value={newIncident.owner}
                        placeholder="Nombre o equipo"
                        onChange={(e) =>
                          setNewIncident({
                            ...newIncident,
                            owner: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="incident-priority">Prioridad</label>
                      <select
                        id="incident-priority"
                        value={newIncident.priority}
                        onChange={(e) =>
                          setNewIncident({
                            ...newIncident,
                            priority: e.target.value as Incident["priority"],
                          })
                        }
                      >
                        {["Baja", "Media", "Alta"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={newIncident.blocked}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          blocked: e.target.checked,
                        })
                      }
                    />{" "}
                    Hay un bloqueo activo
                  </label>
                  <button className="secondary" type="submit">
                    Añadir al turno ↗
                  </button>
                </form>
              </details>
            </section>
            <section className="panel history">
              <p className="eyebrow">HISTORIAL LOCAL</p>
              <h2>
                Turnos entregados{" "}
                <span className="muted">{workspace.history.length}</span>
              </h2>
              {!workspace.history.length && (
                <p className="muted">
                  Al cerrar un turno, aquí quedará su resumen y el equipo
                  entrante recibirá los pendientes.
                </p>
              )}
              {workspace.history.map((h) => (
                <details key={h.id}>
                  <summary>
                    {h.area} · {h.shift}
                    <span>
                      {new Date(h.closedAt).toLocaleString("es-MX", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </summary>
                  <pre>{buildSummary(h)}</pre>
                </details>
              ))}
            </section>
          </div>
          <aside className="panel handoff">
            <p className="eyebrow">02 / ENTREGA</p>
            <h2>Para el siguiente equipo</h2>
            <p className="muted">
              Solo las incidencias abiertas y en curso pasan al siguiente turno.
            </p>
            <label htmlFor="next-action">Siguiente acción</label>
            <textarea
              id="next-action"
              rows={3}
              maxLength={1000}
              value={draft.nextAction}
              onChange={(e) => updateDraft({ nextAction: e.target.value })}
            />
            <div className="preview-heading">
              <h3>Resumen del turno</h3>
              <button className="text-button" onClick={copySummary}>
                Copiar resumen ↗
              </button>
            </div>
            <label className="sr-only" htmlFor="summary">
              Resumen para copiar
            </label>
            <textarea
              id="summary"
              className="summary"
              readOnly
              rows={15}
              value={summary}
            />
            <button className="primary" onClick={closeShift}>
              Cerrar turno y pasar pendientes <span>→</span>
            </button>
            <p className="muted small">
              Guarda esta entrega en el historial y abre el siguiente turno.
            </p>
          </aside>
        </div>
        <p className="error" role="alert">
          {error}
        </p>
        <p className="notice" role="status">
          {notice}
        </p>
        <footer>
          ShiftNote <span>Continuidad entre turnos · React + TypeScript</span>
        </footer>
      </main>
    </div>
  );
}
