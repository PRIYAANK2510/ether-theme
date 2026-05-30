const syntaxRuleDefinitions = [
  { global: true },
  {
    name: "Comment",
    scope: [
      "comment",
      "markup.quote.markdown",
      "meta.diff",
      "meta.diff.header",
    ],
    role: "comment",
    fontStyle: "italic",
  },
  {
    name: "String",
    scope: [
      "string",
      "text.html.php string",
      "markup.inline.raw",
      "punctuation.definition.string",
      "punctuation.definition.markdown",
      "text.html meta.embedded source.js string",
      "text.html.php punctuation.definition.string",
      "text.html meta.embedded source.js punctuation.definition.string",
      "text.html punctuation.definition.string",
      "text.html string",
      "text.html.markdown string.quoted",
      "text.xml string",
      "text.xml punctuation.definition.string",
    ],
    role: "string",
  },
  {
    name: "Number / CSS Unit",
    scope: ["constant.numeric", "source.css keyword.other.unit"],
    role: "number",
  },
  {
    name: "Constant — Language & Built-in",
    scope: [
      "constant",
      "constant.language",
      "support.constant",
      "constant.other.php",
      "support.constant.ext.php",
      "constant.other.class.php",
      "support.constant.core.php",
      "constant.other.caps.python",
      "constant.character.entity.html",
    ],
    role: "cyan",
  },
  {
    name: "TypeScript Primitive Types",
    scope: ["support.type.primitive.ts", "support.type.builtin.ts"],
    role: "cyan",
  },
  {
    name: "Keyword / Storage",
    scope: ["keyword", "storage"],
    role: "keyword",
    fontStyle: "italic",
  },
  {
    name: "Operator",
    scope: ["keyword.operator"],
    role: "cyan",
  },
  {
    name: "Variable",
    scope: ["variable", "support.variable"],
    role: "variable",
  },
  {
    name: "This / Self",
    scope: [
      "variable.language.this",
      "variable.language.this.js",
      "variable.language.special.self.python",
      "variable.language",
    ],
    role: "red",
    fontStyle: "italic",
  },
  {
    name: "Object Property",
    scope: [
      "variable.other.object.property.js.jsx",
      "variable.other.object.js",
      "variable.other.property",
    ],
    role: "number",
  },
  {
    name: "Embedded / Template Expression Text",
    scope: ["meta.template.expression.js", "constant.name.attribute.tag.jade"],
    role: "default",
  },
  {
    name: "Function / Method",
    scope: [
      "entity.name.function",
      "support.function",
      "support.function.magic.python",
      "meta.function-call.generic.python",
      "source.css support.function",
      "source.php support.function",
    ],
    role: "function",
  },
  {
    name: "Type / Class",
    scope: [
      "entity.name.type",
      "support.class",
      "support.type.exception.python",
      "source.js support.type",
    ],
    role: "type",
  },
  {
    name: "Inherited Class",
    scope: ["entity.other.inherited-class"],
    role: "type",
    fontStyle: "italic underline",
  },
  {
    name: "HTML / JSX Tag",
    scope: ["entity.name.tag"],
    role: "red",
  },
  {
    name: "Attribute Name",
    scope: ["entity.other.attribute-name"],
    role: "number",
    fontStyle: "italic",
  },
  {
    name: "CSS ID Selector",
    scope: ["entity.other.attribute-name.id"],
    role: "type",
    fontStyle: "italic",
  },
  {
    name: "CSS Tag / Parent Selector",
    scope: [
      "source.css entity.name.tag.reference",
      "source.css entity.other.attribute-name.parent-selector",
    ],
    role: "red",
  },
  {
    name: "CSS Keyframe Offset",
    scope: ["entity.other.keyframe-offset.css"],
    role: "number",
  },
  {
    name: "CSS At-Rule Extend",
    scope: ["meta.at-rule.extend", "meta.at-rule.extend support.constant"],
    role: "keyword",
  },
  {
    name: "JSON / YAML Keys",
    scope: [
      "meta.structure.dictionary.json support.type.property-name",
      "entity.name.tag.yaml",
    ],
    role: "function",
  },
  {
    name: "Regexp",
    scope: ["string.regexp", "meta.group.regexp"],
    role: "cyan",
  },
  {
    name: "Template Expression Delimiters",
    scope: [
      "punctuation.definition.template-expression",
      "punctuation.definition.interpolation",
      "punctuation.section.embedded.begin.php",
      "punctuation.section.embedded.end.php",
      "punctuation.section.embedded.begin.ruby",
      "punctuation.section.embedded.end.ruby",
    ],
    role: "pink",
  },
  {
    name: "Markup — Heading",
    scope: ["markup.heading", "punctuation.definition.heading.markdown"],
    role: "variable",
    fontStyle: "bold",
  },
  {
    name: "Markup — Bold",
    scope: ["markup.bold"],
    role: "number",
    fontStyle: "bold",
  },
  {
    name: "Markup — Italic",
    scope: ["markup.italic"],
    role: "keyword",
    fontStyle: "italic",
  },
  {
    name: "Markup — List",
    scope: ["markup.list"],
    role: "red",
  },
  {
    name: "Markdown List Bullet",
    scope: ["beginning.punctuation.definition.list.markdown"],
    role: "number",
  },
  {
    name: "Markup — Link / Image",
    scope: ["meta.link", "meta.image"],
    role: "variable",
  },
  {
    name: "Markup — Inserted",
    scope: ["markup.inserted"],
    role: "string",
  },
  {
    name: "Markup — Deleted",
    scope: ["markup.deleted"],
    role: "red",
  },
  {
    name: "Markup — Changed",
    scope: ["markup.changed"],
    role: "number",
  },
  {
    name: "Markdown Metadata Punctuation",
    scope: [
      "punctuation.definition.metadata.markdown",
      "punctuation.definition.string.end.markdown",
      "punctuation.definition.string.begin.markdown",
    ],
    role: "default",
  },
  {
    name: "Fenced Code Block Language",
    scope: ["fenced_code.block.language"],
    role: "number",
  },
  {
    name: "Jade / Pug Class Attribute",
    scope: ["entity.other.attribute-name.class.jade"],
    role: "type",
  },
];

/** Number of TextMate scope rules emitted by {@link buildTokenColors}. */
export const SYNTAX_RULE_COUNT = syntaxRuleDefinitions.length;

/**
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @returns {Array<{ name?: string, scope?: string | string[], settings: { foreground: string, fontStyle?: string } }>}
 */
export function buildTokenColors(syntax) {
  return syntaxRuleDefinitions.map((rule) => {
    if (rule.global) {
      return {
        settings: {
          foreground: syntax.default,
        },
      };
    }

    const settings = {
      foreground: syntax[rule.role],
    };

    if (rule.fontStyle) {
      settings.fontStyle = rule.fontStyle;
    }

    return {
      name: rule.name,
      scope: rule.scope,
      settings,
    };
  });
}
