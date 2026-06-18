import { CORE_WORKBENCH_COLOR_IDS } from "./core-catalog.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "./extension-catalog.js";

/** Core workbench keys required in every generated theme. */
export const WORKBENCH_COLOR_IDS = CORE_WORKBENCH_COLOR_IDS;

export { EXTENSION_WORKBENCH_COLOR_IDS };

/** Full workbench catalog (core + extension). */
export const ALL_WORKBENCH_COLOR_IDS = [
  ...CORE_WORKBENCH_COLOR_IDS,
  ...EXTENSION_WORKBENCH_COLOR_IDS,
];

/** Expected {@link buildTokenColors} rule count for theme validation. */
export { SYNTAX_RULE_COUNT as EXPECTED_SYNTAX_RULE_COUNT } from "../syntax/rules.js";
