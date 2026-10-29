import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const previewRuntimeRoot = fileURLToPath(new URL(".", import.meta.url));
const skillRoot = path.resolve(previewRuntimeRoot, "..");
const examplesSrcRoot = path.join(skillRoot, "examples", "host-integration", "src");

export default defineConfig({
  resolve: {
    alias: [
      { find: "@preview", replacement: examplesSrcRoot },
      {
        find: "@hi-ui/schema-types",
        replacement: path.join(
          examplesSrcRoot,
          "shims",
          "schema-types-empty.js",
        ),
      },
    ],
  },
  server: {
    fs: {
      allow: [previewRuntimeRoot, examplesSrcRoot, skillRoot],
    },
  },
});
