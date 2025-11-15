import { javascript, jsonc, react, sort, stylistic, typescript } from "@cstrlcs/configs/eslint/index.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  },
  sort,
  jsonc,
  javascript,
  typescript,
  react,
  stylistic,
]);
