/**
 * Sync official TextMate grammars for web frameworks into src/grammars/.
 * Sources: MIT-licensed language extensions (Vue, Svelte, MDX, Angular, Astro).
 *
 * Usage: node scripts/sync-framework-grammars.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const syntaxesDir = join(rootDir, "src/grammars/syntaxes");
const configsDir = join(rootDir, "src/grammars/language-configs");

/** @type {Array<{ url: string, dest: string }>} */
const ARTIFACTS = [
  // Vue (Official) — vuejs/language-tools
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/vue.tmLanguage.json",
    dest: "syntaxes/vue.tmLanguage.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/languages/vue-language-configuration.json",
    dest: "language-configs/vue-language-configuration.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/markdown-vue.json",
    dest: "syntaxes/markdown-vue.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/mdx-vue.json",
    dest: "syntaxes/mdx-vue.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/vue-directives.json",
    dest: "syntaxes/vue-directives.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/vue-interpolations.json",
    dest: "syntaxes/vue-interpolations.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/vue-sfc-script-leading-operator-fix.json",
    dest: "syntaxes/vue-sfc-script-leading-operator-fix.json",
  },
  {
    url: "https://raw.githubusercontent.com/vuejs/language-tools/master/extensions/vscode/syntaxes/vue-sfc-style-variable-injection.json",
    dest: "syntaxes/vue-sfc-style-variable-injection.json",
  },

  // Svelte — compiled from YAML sources in sveltejs/language-tools
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.src.yaml",
    dest: "syntaxes/svelte.tmLanguage.json",
    compileYaml: true,
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/language-configuration.json",
    dest: "language-configs/svelte-language-configuration.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/pug-svelte.json",
    dest: "syntaxes/pug-svelte.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/pug-svelte-tags.json",
    dest: "syntaxes/pug-svelte-tags.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/pug-svelte-dotblock.json",
    dest: "syntaxes/pug-svelte-dotblock.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/markdown-svelte.json",
    dest: "syntaxes/markdown-svelte.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/markdown-svelte-js.json",
    dest: "syntaxes/markdown-svelte-js.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/markdown-svelte-css.json",
    dest: "syntaxes/markdown-svelte-css.json",
  },
  {
    url: "https://raw.githubusercontent.com/sveltejs/language-tools/master/packages/svelte-vscode/syntaxes/postcss.src.yaml",
    dest: "syntaxes/svelte-postcss.json",
    compileYaml: true,
  },

  // MDX — mdx-js/mdx-analyzer
  {
    url: "https://raw.githubusercontent.com/mdx-js/mdx-analyzer/main/packages/vscode-mdx/syntaxes/source.mdx.tmLanguage",
    dest: "syntaxes/source.mdx.tmLanguage",
  },
  {
    url: "https://raw.githubusercontent.com/mdx-js/mdx-analyzer/main/packages/vscode-mdx/language-configuration.json",
    dest: "language-configs/mdx-language-configuration.json",
  },
  {
    url: "https://raw.githubusercontent.com/mdx-js/mdx-analyzer/main/packages/vscode-mdx/syntaxes/mdx.markdown.tmLanguage.json",
    dest: "syntaxes/mdx.markdown.tmLanguage.json",
  },

  // Angular template injections — angular/vscode-ng-language-service
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/inline-template.json",
    dest: "syntaxes/angular-inline-template.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/inline-styles.json",
    dest: "syntaxes/angular-inline-styles.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/template.json",
    dest: "syntaxes/angular-template.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/template-blocks.json",
    dest: "syntaxes/angular-template-blocks.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/let-declaration.json",
    dest: "syntaxes/angular-let-declaration.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/host-object-literal.json",
    dest: "syntaxes/angular-host-object-literal.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/template-tag.json",
    dest: "syntaxes/angular-template-tag.json",
  },
  {
    url: "https://raw.githubusercontent.com/angular/vscode-ng-language-service/main/syntaxes/expression.json",
    dest: "syntaxes/angular-expression.json",
  },
];

await mkdir(syntaxesDir, { recursive: true });
await mkdir(configsDir, { recursive: true });

for (const artifact of ARTIFACTS) {
  const target = join(rootDir, "src/grammars", artifact.dest);
  await mkdir(dirname(target), { recursive: true });
  const response = await fetch(artifact.url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${artifact.url}: ${response.status} ${response.statusText}`,
    );
  }
  const text = await response.text();
  const payload = artifact.compileYaml
    ? `${JSON.stringify(yaml.load(text), null, 2)}\n`
    : text;
  await writeFile(target, payload, "utf8");
  console.log(`  ${artifact.dest}`);
}

console.log(`Synced ${ARTIFACTS.length} framework grammar artifact(s).`);
