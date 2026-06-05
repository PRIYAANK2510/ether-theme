/**
 * Fixed JavaScript sample shown in every theme preview.
 * @returns {Array<{ line: number, tokens: Array<{ text: string, role: string }> }>}
 */
export function buildPreviewCodeLines() {
  return [
    {
      line: 1,
      tokens: [{ text: "// Warm up the client cache", role: "comment" }],
    },
    {
      line: 2,
      tokens: [
        { text: "import", role: "keyword" },
        { text: " { createStore } ", role: "default" },
        { text: "from", role: "keyword" },
        { text: ' "valtio";', role: "string" },
      ],
    },
    {
      line: 3,
      tokens: [
        { text: "const", role: "keyword" },
        { text: " BASE_URL ", role: "default" },
        { text: "=", role: "default" },
        { text: ' "https://cdn.example.net";', role: "string" },
      ],
    },
    {
      line: 4,
      tokens: [
        { text: "function", role: "keyword" },
        { text: " ", role: "default" },
        { text: "normalizeId", role: "function" },
        { text: "(raw) {", role: "default" },
      ],
    },
    {
      line: 5,
      tokens: [
        { text: "  ", role: "default" },
        { text: "return", role: "keyword" },
        { text: " ", role: "default" },
        { text: "raw", role: "variable" },
        { text: ".trim().toLowerCase().replace(", role: "default" },
        { text: "/\\s+/g", role: "string" },
        { text: ', "-");', role: "default" },
      ],
    },
    {
      line: 6,
      tokens: [{ text: "}", role: "default" }],
    },
    {
      line: 7,
      tokens: [
        { text: "async", role: "keyword" },
        { text: " ", role: "default" },
        { text: "function", role: "keyword" },
        { text: " ", role: "default" },
        { text: "syncRecords", role: "function" },
        { text: "(items) {", role: "default" },
      ],
    },
    {
      line: 8,
      tokens: [
        { text: "  ", role: "default" },
        { text: "for", role: "keyword" },
        { text: " (", role: "default" },
        { text: "const", role: "keyword" },
        { text: " ", role: "default" },
        { text: "item", role: "variable" },
        { text: " of items) {", role: "default" },
      ],
    },
    {
      line: 9,
      tokens: [
        { text: "    ", role: "default" },
        { text: "await", role: "keyword" },
        { text: " ", role: "default" },
        { text: "fetch", role: "function" },
        { text: "(`${", role: "default" },
        { text: "BASE_URL", role: "variable" },
        { text: "}/sync`, {", role: "default" },
      ],
    },
    {
      line: 10,
      tokens: [
        { text: "      method: ", role: "default" },
        { text: '"POST"', role: "string" },
        { text: ",", role: "default" },
      ],
    },
    {
      line: 11,
      tokens: [
        { text: "      body: ", role: "default" },
        { text: "JSON", role: "type" },
        { text: ".stringify(item),", role: "default" },
      ],
    },
    {
      line: 12,
      tokens: [{ text: "    });", role: "default" }],
    },
    {
      line: 13,
      tokens: [{ text: "  }", role: "default" }],
    },
    {
      line: 14,
      tokens: [{ text: "}", role: "default" }],
    },
    {
      line: 15,
      tokens: [
        { text: "export", role: "keyword" },
        { text: " { normalizeId, syncRecords };", role: "default" },
      ],
    },
  ];
}
