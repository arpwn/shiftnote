import test from "node:test";
import assert from "node:assert/strict";
import {
  getStatus,
  buildSummary,
  validateHandoff,
  nextDraft,
  isWorkspace,
} from "../src/lib/handoff.ts";
const incident = {
  id: "1",
  title: "Revisar inventario",
  owner: "Ana",
  priority: "Alta",
  status: "Abierta",
  blocked: true,
};
const draft = {
  area: "Farmacia",
  shift: "Nocturno",
  author: "Luis",
  nextAction: "Revisar pendientes",
  incidents: [incident],
};
test("resolver una incidencia elimina su impacto operativo", () => {
  assert.equal(getStatus([incident]), "Atención requerida");
  assert.equal(
    getStatus([{ ...incident, status: "Resuelta" }]),
    "Operación estable",
  );
});
test("el siguiente turno conserva únicamente pendientes sin mutar el anterior", () => {
  const previous = {
    ...draft,
    incidents: [incident, { ...incident, id: "2", status: "Resuelta" }],
  };
  const next = nextDraft(previous);
  assert.equal(next.shift, "Matutino");
  assert.equal(next.author, "");
  assert.equal(next.incidents.length, 1);
  next.incidents[0].owner = "Otro equipo";
  assert.equal(previous.incidents[0].owner, "Ana");
  assert.equal(previous.incidents.length, 2);
});
test("el resumen usa singular y el cierre exige responsable y siguiente acción", () => {
  assert.match(buildSummary(draft), /Se registró 1 incidencia/);
  assert.equal(validateHandoff(draft), null);
  assert.ok(
    validateHandoff({ ...draft, incidents: [{ ...incident, owner: "" }] }),
  );
  assert.ok(validateHandoff({ ...draft, nextAction: " " }));
  assert.equal(isWorkspace({ draft, history: [] }), true);
  assert.equal(isWorkspace({ draft: {}, history: [] }), false);
});
