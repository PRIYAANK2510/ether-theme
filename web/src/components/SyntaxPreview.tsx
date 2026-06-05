export function SyntaxPreview() {
  return (
    <div className="syntax-preview" aria-label="Live syntax highlighting preview">
      <div className="syntax-preview-chrome">
        <span className="dot dot-red" aria-hidden="true" />
        <span className="dot dot-yellow" aria-hidden="true" />
        <span className="dot dot-green" aria-hidden="true" />
        <span className="syntax-preview-file">App.tsx</span>
      </div>
      <pre className="syntax-preview-code">
        <code>
          <span className="syn-keyword">import</span>{" "}
          <span className="syn-default">{"{ useState }"}</span>{" "}
          <span className="syn-keyword">from</span>{" "}
          <span className="syn-string">'react'</span>
          {"\n\n"}
          <span className="syn-keyword">export function</span>{" "}
          <span className="syn-function">Counter</span>
          <span className="syn-default">() {"{"}</span>
          {"\n  "}
          <span className="syn-keyword">const</span>{" "}
          <span className="syn-default">[</span>
          <span className="syn-variable">count</span>
          <span className="syn-default">, </span>
          <span className="syn-variable">setCount</span>
          <span className="syn-default">] = </span>
          <span className="syn-function">useState</span>
          <span className="syn-default">(</span>
          <span className="syn-number">0</span>
          <span className="syn-default">)</span>
          {"\n  "}
          <span className="syn-comment">// Ether theme syntax colors</span>
          {"\n  "}
          <span className="syn-keyword">return</span>{" "}
          <span className="syn-default">&lt;</span>
          <span className="syn-type">button</span>
          <span className="syn-default">&gt;{"{"}</span>
          <span className="syn-variable">count</span>
          <span className="syn-default">{"}"}&lt;/</span>
          <span className="syn-type">button</span>
          <span className="syn-default">&gt;</span>
          {"\n"}
          <span className="syn-default">{"}"}</span>
        </code>
      </pre>
    </div>
  );
}
