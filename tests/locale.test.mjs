import test from "node:test";
import assert from "node:assert/strict";
import { translate } from "../src/lib/translations.ts";
test("changes interface labels while preserving free text and template parameters", () => {
  assert.equal(translate("Área", "en"), "Department");
  assert.equal(translate("Área", "es"), "Área");
  assert.equal(
    translate("Estado de {0}", "en", ["Mi incidencia"]),
    "Status of Mi incidencia",
  );
  assert.equal(
    translate("Texto escrito por el usuario", "en"),
    "Texto escrito por el usuario",
  );
});
