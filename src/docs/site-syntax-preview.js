export function renderSyntaxPreview() {
  return `<div class="syntax-preview" aria-label="Live syntax highlighting preview">
  <div class="syntax-preview-chrome">
    <span class="dot dot-red" aria-hidden="true"></span>
    <span class="dot dot-yellow" aria-hidden="true"></span>
    <span class="dot dot-green" aria-hidden="true"></span>
    <span class="syntax-preview-file">App.tsx</span>
  </div>
  <pre class="syntax-preview-code"><code><span class="syn-keyword">import</span> <span class="syn-default">{ useState }</span> <span class="syn-keyword">from</span> <span class="syn-string">'react'</span>

<span class="syn-keyword">export function</span> <span class="syn-function">Counter</span><span class="syn-default">() {</span>
  <span class="syn-keyword">const</span> <span class="syn-default">[</span><span class="syn-variable">count</span><span class="syn-default">, </span><span class="syn-variable">setCount</span><span class="syn-default">] = </span><span class="syn-function">useState</span><span class="syn-default">(</span><span class="syn-number">0</span><span class="syn-default">)</span>
  <span class="syn-comment">// Ether theme syntax colors</span>
  <span class="syn-keyword">return</span> <span class="syn-default">&lt;</span><span class="syn-type">button</span> <span class="syn-variable">onClick</span><span class="syn-default">={() =&gt; </span><span class="syn-function">setCount</span><span class="syn-default">(</span><span class="syn-variable">c</span> <span class="syn-default">=&gt; </span><span class="syn-variable">c</span> <span class="syn-default">+ </span><span class="syn-number">1</span><span class="syn-default">)}&gt;</span>
    <span class="syn-default">{</span><span class="syn-variable">count</span><span class="syn-default">}</span>
  <span class="syn-default">&lt;/</span><span class="syn-type">button</span><span class="syn-default">&gt;</span>
<span class="syn-default">}</span></code></pre>
</div>`;
}
