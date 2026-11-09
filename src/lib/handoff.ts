export const shifts = ["Matutino", "Vespertino", "Nocturno"] as const;
export type Shift = (typeof shifts)[number];
export type Incident = {
  id: string;
  title: string;
  owner: string;
  priority: "Baja" | "Media" | "Alta";
  status: "Abierta" | "En curso" | "Resuelta";
  blocked: boolean;
};
export type ShiftDocument = {
  area: string;
  shift: Shift;
  author: string;
  nextAction: string;
  incidents: Incident[];
};
export type ClosedShift = ShiftDocument & { id: string; closedAt: string };
export type Workspace = { draft: ShiftDocument; history: ClosedShift[] };
export function getStatus(incidents: Incident[]) {
  const pending = incidents.filter((i) => i.status !== "Resuelta");
  return pending.some((i) => i.blocked || i.priority === "Alta")
    ? "Atención requerida"
    : pending.length
      ? "Seguimiento pendiente"
      : "Operación estable";
}
export function buildSummary(draft: ShiftDocument) {
  const pending = draft.incidents.filter((i) => i.status !== "Resuelta");
  const count = draft.incidents.length;
  return `ENTREGA DE TURNO · ${draft.area}\nTurno: ${draft.shift}\nEntrega: ${draft.author.trim() || "Sin indicar"}\nEstado: ${getStatus(draft.incidents)}\n\nSe ${count === 1 ? "registró 1 incidencia" : `registraron ${count} incidencias`}. ${pending.length} ${pending.length === 1 ? "pendiente" : "pendientes"} para seguimiento.\n\n${draft.incidents.map((i, index) => `${index + 1}. ${i.title}\n   ${i.status} · Prioridad ${i.priority.toLowerCase()}${i.blocked && i.status !== "Resuelta" ? " · BLOQUEADA" : ""}\n   Responsable: ${i.owner.trim() || "Por asignar"}`).join("\n\n") || "Sin incidencias registradas."}\n\nSiguiente acción: ${draft.nextAction.trim() || "Sin indicar"}`;
}
export function validateHandoff(draft: ShiftDocument) {
  if (!draft.author.trim()) return "Indica quién entrega el turno.";
  if (!draft.nextAction.trim())
    return "Escribe la siguiente acción para el equipo entrante.";
  if (draft.incidents.some((i) => i.status !== "Resuelta" && !i.owner.trim()))
    return "Asigna un responsable a cada incidencia pendiente.";
  return null;
}
export function nextDraft(draft: ShiftDocument): ShiftDocument {
  return {
    ...draft,
    shift: shifts[(shifts.indexOf(draft.shift) + 1) % shifts.length],
    author: "",
    nextAction: "",
    incidents: draft.incidents
      .filter((i) => i.status !== "Resuelta")
      .map((i) => ({ ...i })),
  };
}
function isIncident(value: unknown): value is Incident {
  if (!value || typeof value !== "object") return false;
  const i = value as Incident;
  return (
    typeof i.id === "string" &&
    typeof i.title === "string" &&
    typeof i.owner === "string" &&
    ["Baja", "Media", "Alta"].includes(i.priority) &&
    ["Abierta", "En curso", "Resuelta"].includes(i.status) &&
    typeof i.blocked === "boolean"
  );
}
function isDocument(value: unknown): value is ShiftDocument {
  if (!value || typeof value !== "object") return false;
  const d = value as ShiftDocument;
  return (
    typeof d.area === "string" &&
    shifts.includes(d.shift) &&
    typeof d.author === "string" &&
    typeof d.nextAction === "string" &&
    Array.isArray(d.incidents) &&
    d.incidents.every(isIncident)
  );
}
export function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const w = value as Workspace;
  return (
    isDocument(w.draft) &&
    Array.isArray(w.history) &&
    w.history.every(
      (h) =>
        isDocument(h) &&
        typeof h.id === "string" &&
        typeof h.closedAt === "string" &&
        Number.isFinite(Date.parse(h.closedAt)),
    )
  );
}
