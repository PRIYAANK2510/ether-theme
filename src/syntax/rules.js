/** @typedef {{ global?: true, name?: string, scope?: string | string[], role?: keyof import("../utils/color.js").PaletteSyntaxTokens, fontStyle?: string }} SyntaxRuleDefinition */

/** @type {SyntaxRuleDefinition[]} */
const syntaxRuleDefinitions = [
  { global: true },

  {
    name: "Invalid",
    scope: ["invalid", "invalid.illegal", "invalid.unimplemented", "invalid.deprecated"],
    role: "red",
  },

  {
    name: "Embedded Language Reset",
    scope: [
      "meta.embedded",
      "meta.embedded.line",
      "meta.embedded.block",
      "meta.template.expression",
      "meta.template.expression.js",
      "meta.template.expression.ts",
      "meta.template.expression.tsx",
      "meta.template.expression.jsx",
      "meta.embedded.expression.js",
      "meta.embedded.expression.ts",
      "meta.embedded.expression.tsx",
      "meta.embedded.expression.jsx",
      "meta.jsx.children.tsx",
      "meta.jsx.children.jsx",
      "meta.embedded.assembly",
      "source.groovy.embedded",
      "variable.legacy.builtin.python",
      "string meta.image.inline.markdown",
    ],
    role: "default",
  },

  {
    name: "Comment",
    scope: [
      "comment",
      "markup.quote.markdown",
      "meta.diff",
    ],
    role: "comment",
    fontStyle: "italic",
  },

  {
    name: "Documentation Comment",
    scope: [
      "comment.block.documentation",
      "comment.line.double-slash.documentation",
      "comment.block.documentation.js",
      "comment.block.documentation.ts",
      "comment.block.documentation.tsx",
      "comment.block.documentation.jsx",
      "comment.block.documentation.java",
      "comment.block.documentation.python",
      "comment.block.documentation.php",
      "comment.block.documentation.rust",
      "comment.line.double-slash.documentation.cpp",
      "comment.block.documentation.cpp",
      "comment.line.number-sign.documentation",
    ],
    role: "comment",
    fontStyle: "italic",
  },

  {
    name: "JSDoc / Doc Tag",
    scope: [
      "storage.type.class.doxygen",
      "storage.type.class.doxygen.cpp",
      "storage.type.class.jsdoc",
      "punctuation.definition.block.tag.jsdoc",
      "punctuation.definition.inline.tag.jsdoc",
      "keyword.operator.control.jsdoc",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "JSDoc / Doc Type Reference",
    scope: [
      "entity.name.type.instance.jsdoc",
      "constant.language.symbol-type.jsdoc",
      "constant.language.access-type.jsdoc",
      "entity.name.tag.inline.jsdoc",
      "punctuation.definition.bracket.angle.begin.jsdoc",
      "punctuation.definition.bracket.angle.end.jsdoc",
      "meta.example.jsdoc",
    ],
    role: "type",
  },

  {
    name: "JSDoc / Doc Parameter & Name",
    scope: [
      "variable.other.jsdoc",
      "variable.parameter.jsdoc",
      "variable.other.link.underline.jsdoc",
      "constant.other.description.jsdoc",
      "constant.other.email.link.underline.jsdoc",
    ],
    role: "variable",
    fontStyle: "italic",
  },

  {
    name: "String",
    scope: [
      "string",
      "string.tag",
      "string.value",
      "string.quoted",
      "string.template",
      "string.interpolated",
      "string.regexp.character-class",
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
      "meta.preprocessor.string",
      "string.unquoted.heredoc",
      "string.unquoted.heredoc.shell",
      "string.quoted.double.shell",
      "string.quoted.single.shell",
    ],
    role: "string",
  },

  {
    name: "String Escape",
    scope: [
      "constant.character.escape",
      "constant.character",
      "constant.other.option",
    ],
    role: "pink",
  },

  {
    name: "Number / CSS Unit",
    scope: [
      "constant.numeric",
      "constant.numeric.integer",
      "constant.numeric.float",
      "constant.numeric.hex",
      "keyword.other.unit",
      "source.css keyword.other.unit",
      "meta.preprocessor.numeric",
      "keyword.operator.plus.exponent",
      "keyword.operator.minus.exponent",
    ],
    role: "number",
  },

  {
    name: "Constant / Enum Member",
    scope: [
      "variable.other.constant",
      "variable.other.enummember",
      "variable.other.constant.property",
      "constant.language.boolean",
      "constant.language.json",
      "constant.language.null",
      "constant.language.undefined",
    ],
    role: "cyan",
  },

  {
    name: "Constant — Language & Built-in",
    scope: [
      "constant.language",
      "support.constant",
      "constant.other.php",
      "support.constant.ext.php",
      "constant.other.class.php",
      "support.constant.core.php",
      "constant.other.caps.python",
      "constant.character.entity.html",
      "constant.character.entity.tsx",
      "constant.character.entity.jsx",
      "constant.sha.git-rebase",
      "support.constant.math",
      "support.constant.dom",
      "support.constant.json",
      "constant.other.placeholder",
      "constant.character.graphql",
    ],
    role: "cyan",
  },

  {
    name: "TypeScript Primitive Types",
    scope: [
      "support.type.primitive.ts",
      "support.type.primitive.tsx",
      "support.type.builtin.ts",
      "support.type.builtin.tsx",
      "support.type.builtin.js",
      "support.type.builtin.jsx",
    ],
    role: "cyan",
  },

  {
    name: "Parameter",
    scope: [
      "variable.parameter",
      "variable.parameter.ts",
      "variable.parameter.tsx",
      "meta.parameter",
      "meta.definition.parameters",
      "variable.parameter.function",
      "variable.parameter.constructor",
      "variable.parameter.cs",
      "variable.parameter.java",
    ],
    role: "variable",
  },

  {
    name: "Keyword / Control",
    scope: [
      "keyword.control",
      "keyword.control.flow",
      "keyword.control.import",
      "keyword.control.module",
      "keyword.control.loop",
      "keyword.control.conditional",
      "keyword.control.trycatch",
      "keyword.control.switch",
      "keyword.control.directive",
      "keyword.control.import.cpp",
      "keyword.other.using",
      "keyword.other.directive",
      "keyword.other.directive.using",
      "keyword.other.operator",
      "keyword.other.rust",
      "keyword.other.DML.sql",
      "keyword.other.DDL.sql",
      "keyword.other.create.sql",
      "keyword.operator.new",
      "keyword.operator.delete",
      "keyword.operator.expression",
      "keyword.operator.cast",
      "keyword.operator.sizeof",
      "keyword.operator.instanceof",
      "keyword.operator.logical.python",
      "keyword.operator.wordlike",
      "keyword.operator.noexcept",
      "keyword.operator.arrow",
      "keyword.control.heredoc-shell",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "Keyword / Storage & Modifier",
    scope: [
      "keyword",
      "storage",
      "storage.modifier",
      "storage.modifier.import",
      "storage.modifier.package",
      "storage.modifier.async",
      "storage.modifier.rust",
      "keyword.declaration",
      "keyword.other.declaration",
      "keyword.other.declaration.swift",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "Operator",
    scope: [
      "keyword.operator",
      "entity.name.operator",
      "keyword.operator.assignment",
      "keyword.operator.arithmetic",
      "keyword.operator.comparison",
      "keyword.operator.relational",
    ],
    role: "cyan",
  },

  {
    name: "Variable",
    scope: [
      "variable",
      "variable.other.readwrite",
      "variable.other.member",
      "variable.other.global",
      "variable.other.local",
      "variable.other.global.cs",
      "variable.other.object",
      "entity.name.variable",
      "meta.definition.variable.name",
      "support.variable",
      "source.css variable",
      "source.css.scss variable",
      "source.css.less variable",
      "variable.scss",
      "variable.parameter.scss",
      "variable.argument.css",
      "source.coffee.embedded",
      "variable.other.assignment.shell",
      "variable.other.normal.shell",
    ],
    role: "variable",
  },

  {
    name: "This / Self / Super",
    scope: [
      "variable.language.this",
      "variable.language.this.js",
      "variable.language.special.self.python",
      "variable.language.super",
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
      "variable.other.property.ts",
      "variable.other.property.tsx",
      "support.type.property-name",
      "support.type.vendored.property-name",
      "support.type.property-name.css",
      "support.type.property-name.scss",
    ],
    role: "number",
  },

  {
    name: "Object Literal Key",
    scope: [
      "meta.object-literal.key",
      "meta.object-literal.key.ts",
      "meta.object-literal.key.tsx",
      "meta.object-literal.key.js",
      "meta.structure.dictionary.key.python",
      "meta.key-value.key",
    ],
    role: "number",
  },

  {
    name: "Function / Method",
    scope: [
      "entity.name.function",
      "entity.name.function.member",
      "entity.name.function.call",
      "entity.name.function.constructor",
      "entity.name.function.destructor",
      "entity.name.function.macro",
      "entity.name.function.macro.rules",
      "entity.name.function.preprocessor",
      "entity.name.function.operator",
      "entity.name.operator.custom-literal",
      "meta.function-call",
      "meta.function-call.generic",
      "meta.function-call.generic.python",
      "meta.function-call.php",
      "support.function",
      "support.function.builtin",
      "support.function.magic.python",
      "support.function.aggregate.sql",
      "support.function.builtin.shell",
      "support.function.construct",
      "support.function.construct.php",
      "support.constant.handlebars",
      "source.css support.function",
      "source.php support.function",
      "support.function.git-rebase",
      "source.powershell variable.other.member",
    ],
    role: "function",
  },

  {
    name: "Annotation / Decorator",
    scope: [
      "punctuation.definition.decorator",
      "punctuation.definition.annotation",
      "entity.name.function.decorator",
      "entity.name.function.decorator.python",
      "punctuation.definition.decorator.python",
      "storage.type.annotation",
    ],
    role: "function",
    fontStyle: "italic underline",
  },

  {
    name: "Type / Class / Interface",
    scope: [
      "entity.name.type",
      "entity.name.type.class",
      "entity.name.type.interface",
      "entity.name.type.enum",
      "entity.name.type.struct",
      "entity.name.type.union",
      "entity.name.type.alias",
      "entity.name.type.lifetime",
      "entity.name.type.type-parameter",
      "entity.name.type.parameter",
      "entity.name.class",
      "entity.name.namespace",
      "entity.name.scope-resolution",
      "entity.other.attribute",
      "entity.name.fragment.graphql",
      "support.class",
      "support.class.builtin",
      "support.class.php",
      "support.type",
      "support.type.object.js",
      "support.type.object.ts",
      "support.type.type-parameter",
      "support.type.graphql",
      "support.type.exception.python",
      "source.js support.type",
      "source.ts support.type",
      "source.tsx support.type",
      "meta.type.cast.expr",
      "meta.type.new.expr",
      "meta.type.parameters",
      "punctuation.definition.typeparameters",
      "punctuation.section.typeparameters",
      "punctuation.separator.namespace.ruby",
      "storage.type",
      "storage.type.rust",
      "storage.type.swift",
      "storage.type.annotation.java",
      "storage.type.generic.java",
      "storage.type.java",
      "storage.type.primitive.java",
      "storage.type.cs",
      "storage.type.generic.cs",
      "storage.type.modifier.cs",
      "storage.type.variable.cs",
      "storage.type.groovy",
      "storage.type.annotation.groovy",
      "storage.type.parameters.groovy",
      "storage.type.generic.groovy",
      "storage.type.numeric.go",
      "storage.type.byte.go",
      "storage.type.string.go",
      "storage.type.boolean.go",
      "storage.type.error.go",
      "storage.type.rune.go",
      "storage.type.uintptr.go",
      "storage.type.struct",
      "storage.modifier.lifetime",
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
    name: "React / Component",
    scope: [
      "support.class.component",
      "support.class.component.tsx",
      "support.class.component.jsx",
      "support.class.component.ts",
    ],
    role: "type",
  },

  {
    name: "HTML / JSX Tag",
    scope: [
      "entity.name.tag",
      "entity.name.tag.jsx",
      "entity.name.tag.tsx",
      "entity.name.tag.html",
      "entity.name.tag.xml",
      "entity.name.tag.namespace.tsx",
      "entity.name.tag.namespace.jsx",
      "punctuation.separator.namespace.tsx",
      "punctuation.separator.namespace.jsx",
    ],
    role: "red",
  },

  {
    name: "CSS HTML Tag",
    scope: [
      "entity.name.tag.css",
      "entity.name.tag.less",
      "entity.name.tag.scss",
      "entity.name.tag.stylus",
    ],
    role: "type",
  },

  {
    name: "Attribute Name",
    scope: [
      "entity.other.attribute-name",
      "entity.other.attribute-name.jsx",
      "entity.other.attribute-name.tsx",
      "entity.other.attribute-name.html",
      "meta.attribute-with-value",
    ],
    role: "number",
  },

  {
    name: "CSS Selector — Class / Pseudo",
    scope: [
      "entity.other.attribute-name.class.css",
      "entity.other.attribute-name.class.scss",
      "entity.other.attribute-name.class.less",
      "source.css entity.other.attribute-name.class",
      "source.css entity.other.attribute-name.pseudo-class",
      "entity.other.attribute-name.pseudo-element.css",
      "entity.other.attribute-name.parent-selector.css",
      "entity.other.attribute-name.parent.less",
      "source.css.less entity.other.attribute-name.id",
      "entity.other.attribute-name.scss",
    ],
    role: "type",
  },

  {
    name: "CSS ID Selector",
    scope: [
      "entity.other.attribute-name.id",
      "entity.other.attribute-name.id.css",
    ],
    role: "type",
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
    name: "CSS Property Value",
    scope: [
      "support.constant.property-value",
      "support.constant.font-name",
      "support.constant.media-type",
      "support.constant.media",
      "support.constant.color",
      "constant.other.color.rgb-value",
      "constant.other.rgb-value",
    ],
    role: "string",
  },

  {
    name: "CSS Keyframe Offset",
    scope: ["entity.other.keyframe-offset.css"],
    role: "number",
  },

  {
    name: "CSS At-Rule",
    scope: [
      "meta.at-rule",
      "meta.at-rule.extend",
      "meta.at-rule.extend support.constant",
      "meta.preprocessor",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "JSON / YAML / TOML Keys",
    scope: [
      "meta.structure.dictionary.json support.type.property-name",
      "entity.name.tag.yaml",
      "keyword.key.toml",
      "entity.name.section.toml",
      "entity.name.section.yaml",
      "entity.name.section.ini",
      "entity.name.section.config",
      "entity.name.section.markdown",
    ],
    role: "function",
  },

  {
    name: "Regexp",
    scope: [
      "string.regexp",
      "constant.regexp",
      "meta.group.regexp",
    ],
    role: "cyan",
  },

  {
    name: "Regexp — Character Class",
    scope: [
      "constant.character.character-class.regexp",
      "constant.other.character-class.regexp",
      "constant.other.character-class.set.regexp",
      "constant.character.set.regexp",
    ],
    role: "red",
  },

  {
    name: "Regexp — Operator",
    scope: [
      "punctuation.definition.group.regexp",
      "punctuation.definition.group.assertion.regexp",
      "punctuation.definition.character-class.regexp",
      "punctuation.character.set.begin.regexp",
      "punctuation.character.set.end.regexp",
      "keyword.operator.or.regexp",
      "keyword.control.anchor.regexp",
      "keyword.operator.quantifier.regexp",
      "keyword.operator.negation.regexp",
      "support.other.parenthesis.regexp",
    ],
    role: "pink",
  },

  {
    name: "Template Expression Delimiters",
    scope: [
      "punctuation.definition.template-expression",
      "punctuation.definition.template-expression.begin",
      "punctuation.definition.template-expression.end",
      "punctuation.definition.interpolation",
      "punctuation.section.embedded",
      "punctuation.section.embedded.begin",
      "punctuation.section.embedded.end",
      "punctuation.section.embedded.begin.php",
      "punctuation.section.embedded.end.php",
      "punctuation.section.embedded.begin.ruby",
      "punctuation.section.embedded.end.ruby",
      "punctuation.section.embedded.begin.tsx",
      "punctuation.section.embedded.end.tsx",
      "punctuation.section.embedded.begin.jsx",
      "punctuation.section.embedded.end.jsx",
      "punctuation.section.embedded.begin.js",
      "punctuation.section.embedded.end.js",
      "punctuation.definition.generic.begin",
      "punctuation.definition.generic.end",
    ],
    role: "pink",
  },

  {
    name: "Punctuation / Brackets",
    scope: [
      "punctuation.definition.tag",
      "punctuation.definition.tag.begin",
      "punctuation.definition.tag.end",
      "punctuation.separator",
      "punctuation.separator.dot",
      "punctuation.separator.colon",
      "punctuation.separator.delimiter",
      "punctuation.terminator",
      "punctuation.accessor",
      "meta.brace",
      "punctuation.section.block",
      "punctuation.section.brackets",
      "punctuation.section.parens",
      "punctuation.section.array",
      "punctuation.section.scope",
    ],
    role: "comment",
  },

  {
    name: "Java Import / Package",
    scope: [
      "storage.modifier.import.java",
      "storage.modifier.package.java",
      "variable.language.wildcard.java",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "Kotlin — Keyword & Modifier",
    scope: [
      "keyword.soft.kotlin",
      "keyword.hard.kotlin",
      "keyword.hard.package.kotlin",
      "keyword.hard.class.kotlin",
      "keyword.hard.object.kotlin",
      "keyword.hard.typealias.kotlin",
      "keyword.hard.fun.kotlin",
      "keyword.control.kotlin",
      "storage.modifier.other.kotlin",
      "storage.modifier.kotlin",
      "storage.type.function.arrow.kotlin",
      "keyword.operator.assignment.kotlin",
      "keyword.operator.assignment.arithmetic.kotlin",
      "keyword.operator.arithmetic.kotlin",
      "keyword.operator.comparison.kotlin",
      "keyword.operator.logical.kotlin",
      "keyword.operator.increment-decrement.kotlin",
      "keyword.operator.range.kotlin",
      "variable.language.wildcard.kotlin",
    ],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "Kotlin — Type & Declaration",
    scope: [
      "entity.name.type.kotlin",
      "entity.name.type.class.kotlin",
      "entity.name.type.object.kotlin",
      "entity.name.type.class.extension.kotlin",
      "entity.name.function.declaration.kotlin",
      "entity.name.function.call.kotlin",
      "entity.name.function.reference.kotlin",
      "entity.name.package.kotlin",
      "meta.import.kotlin",
      "meta.package.kotlin",
      "meta.class.kotlin",
    ],
    role: "type",
  },

  {
    name: "Kotlin — Comment",
    scope: [
      "comment.line.double-slash.kotlin",
      "comment.block.kotlin",
      "comment.block.javadoc.kotlin",
      "keyword.other.documentation.javadoc.kotlin",
    ],
    role: "comment",
    fontStyle: "italic",
  },

  {
    name: "Label / Goto",
    scope: [
      "entity.name.label",
      "entity.name.tag.goto",
      "entity.name.goto-label",
    ],
    role: "default",
  },

  {
    name: "Markup — Heading",
    scope: [
      "markup.heading",
      "punctuation.definition.heading.markdown",
      "entity.name.section.markdown",
    ],
    role: "variable",
    fontStyle: "bold",
  },

  {
    name: "Markup — Bold",
    scope: ["markup.bold", "strong"],
    role: "number",
    fontStyle: "bold",
  },

  {
    name: "Markup — Italic",
    scope: ["markup.italic", "emphasis"],
    role: "keyword",
    fontStyle: "italic",
  },

  {
    name: "Markup — Underline",
    scope: ["markup.underline"],
    role: "default",
    fontStyle: "underline",
  },

  {
    name: "Markup — Strikethrough",
    scope: ["markup.strikethrough"],
    role: "default",
    fontStyle: "strikethrough",
  },

  {
    name: "Markup — List",
    scope: ["markup.list"],
    role: "red",
  },

  {
    name: "Markdown List Bullet",
    scope: [
      "beginning.punctuation.definition.list.markdown",
      "punctuation.definition.list.begin.markdown",
    ],
    role: "number",
  },

  {
    name: "Markup — Link / Image",
    scope: ["meta.link", "meta.image"],
    role: "variable",
    fontStyle: "italic",
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
    scope: ["markup.changed", "meta.diff.header"],
    role: "number",
  },

  {
    name: "Markdown Code Fence",
    scope: [
      "markup.fenced_code.block.markdown",
      "markup.raw.block.markdown",
      "markup.raw.inline.markdown",
      "fenced_code.block.language",
      "fenced_code.block.language.markdown",
    ],
    role: "number",
  },

  {
    name: "Markdown Metadata Punctuation",
    scope: [
      "punctuation.definition.metadata.markdown",
      "punctuation.definition.string.end.markdown",
      "punctuation.definition.string.begin.markdown",
      "punctuation.definition.quote.begin.markdown",
    ],
    role: "default",
  },

  {
    name: "Jade / Pug Class Attribute",
    scope: [
      "entity.other.attribute-name.class.jade",
      "constant.name.attribute.tag.jade",
    ],
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
