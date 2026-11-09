export type Language = "es" | "en";
export const translations: Record<Language, Record<string, string>> = {
  en: {
    "01 / SEGUIMIENTO": "01 / TRACKING",
    "02 / ENTREGA": "02 / HANDOFF",
    "Al cerrar un turno, aquí quedará su resumen y el equipo entrante recibirá los pendientes.":
      "Close a shift to save its summary here and pass pending incidents to the next team.",
    "Añadir al turno ↗": "Add to shift ↗",
    Bloqueada: "Blocked",
    "CONTINUIDAD OPERATIVA": "OPERATIONAL CONTINUITY",
    "Cerrar turno y pasar pendientes": "Close shift and pass pending incidents",
    "Continuidad entre turnos · React + TypeScript":
      "Continuity between shifts · React + TypeScript",
    "Copiar resumen ↗": "Copy summary ↗",
    "Código ↗": "Source code ↗",
    "Datos del turno": "Shift details",
    "Describe la incidencia": "Describe the incident",
    "ESPACIO DE DEMOSTRACIÓN · GUARDADO LOCAL":
      "DEMO WORKSPACE · LOCAL STORAGE",
    "El contexto se queda.": "The context stays.",
    "El turno cambia.": "The shift changes.",
    "Empieza con dos incidencias de ejemplo. Edita sus responsables y estados o añade las tuyas.":
      "Start with two sample incidents. Edit their owners and statuses or add your own.",
    Estado: "Status",
    "Estado de {0}": "Status of {0}",
    "Filtrar incidencias": "Filter incidents",
    "Guarda esta entrega en el historial y abre el siguiente turno.":
      "Save this handoff to history and open the next shift.",
    "HISTORIAL LOCAL": "LOCAL HISTORY",
    "Hay un bloqueo activo": "There is an active blocker",
    "Incidencias, responsables y próximos pasos para el equipo que sigue.":
      "Incidents, owners, and next steps for the incoming team.",
    "Lo que necesita atención": "What needs attention",
    "No hay incidencias en este estado.": "No incidents with this status.",
    "Nombre o equipo": "Name or team",
    "Para el siguiente equipo": "For the next team",
    Prioridad: "Priority",
    "Quién entrega": "Handed over by",
    "Qué pasó": "What happened",
    Responsable: "Owner",
    "Responsable de {0}": "Owner of {0}",
    "Resumen del turno": "Shift summary",
    "Resumen para copiar": "Summary to copy",
    "Siguiente acción": "Next action",
    "Solo las incidencias abiertas y en curso pasan al siguiente turno.":
      "Only open and in-progress incidents move to the next shift.",
    "Tiene un bloqueo activo": "Has an active blocker",
    "Tu nombre o equipo": "Your name or team",
    Turno: "Shift",
    "Turnos entregados": "Completed handoffs",
    bloqueo: "blocker",
    bloqueos: "blockers",
    de: "of",
    pendiente: "pending",
    pendientes: "pending",
    Área: "Department",
    "＋ Añadir incidencia": "＋ Add incident",
    Todas: "All",
    Farmacia: "Pharmacy",
    Sistemas: "IT",
    Compras: "Purchasing",
    "Atención al cliente": "Customer service",
    Baja: "Low",
    Media: "Medium",
    Alta: "High",
    Revisar: "Review",
    "Operación estable": "Stable operations",
    "Atención requerida": "Attention required",
    "Seguimiento pendiente": "Follow-up pending",
    Abierta: "Open",
    "En curso": "In progress",
    Resuelta: "Resolved",
    Matutino: "Morning",
    Vespertino: "Afternoon",
    Nocturno: "Night",
    "Cambios disponibles en esta sesión; el navegador no permitió guardarlos.":
      "Changes are available for this session; the browser did not allow them to be saved.",
    "Escribe la incidencia y su responsable.":
      "Enter the incident and its owner.",
    "Incidencia añadida al turno.": "Incident added to the shift.",
    "Resumen copiado.": "Summary copied.",
    "Selecciona y copia el resumen directamente del campo de texto.":
      "Select and copy the summary directly from the text field.",
    "Indica quién entrega el turno.": "Enter who is handing over the shift.",
    "Escribe la siguiente acción para el equipo entrante.":
      "Enter the next action for the incoming team.",
    "Asigna un responsable a cada incidencia pendiente.":
      "Assign an owner to every pending incident.",
    "Restablecer acceso a terminal": "Restore terminal access",
    "Validar inventario de insumos": "Check supply inventory",
    "Mesa de ayuda": "Help desk",
    "Turno entrante": "Incoming shift",
    "Confirmar el acceso a la terminal y validar el inventario.":
      "Confirm terminal access and check inventory.",
  },
  es: {},
};
export function translate(
  value: string | number | null | undefined,
  lang: Language,
  parameters: (string | number)[] = [],
): string {
  const key = String(value ?? "");

  const handoff = key.match(
    /^Turno cerrado\. (\d+) pendiente(?:s)? transferido(?:s)? al turno (matutino|vespertino|nocturno)\.$/,
  );
  if (lang === "en" && handoff) {
    const shift = (
      {
        matutino: "morning",
        vespertino: "afternoon",
        nocturno: "night",
      } as Record<string, string>
    )[handoff[2]];
    return `Shift closed. ${handoff[1]} pending ${handoff[1] === "1" ? "incident transferred" : "incidents transferred"} to the ${shift} shift.`;
  }
  const text = translations[lang][key] ?? key;
  return text.replace(/\{(\d+)\}/g, (token, index) =>
    parameters[Number(index)] === undefined
      ? token
      : String(parameters[Number(index)]),
  );
}
