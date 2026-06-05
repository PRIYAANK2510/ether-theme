import styles from "./SyntaxPreview.module.scss";

export function SyntaxPreview() {
  return (
    <div className={styles.root} aria-label="Live syntax highlighting preview">
      <div className={styles.chrome}>
        <span className={styles.dotRed} aria-hidden="true" />
        <span className={styles.dotYellow} aria-hidden="true" />
        <span className={styles.dotGreen} aria-hidden="true" />
        <span className={styles.file}>App.tsx</span>
      </div>
      <pre className={styles.code}>
        <code>
          <span className={styles.keyword}>import</span>{" "}
          <span className={styles["default"]}>{"{ useState }"}</span>{" "}
          <span className={styles.keyword}>from</span>{" "}
          <span className={styles.string}>'react'</span>
          {"\n\n"}
          <span className={styles.keyword}>export function</span>{" "}
          <span className={styles.function}>Counter</span>
          <span className={styles["default"]}>() {"{"}</span>
          {"\n  "}
          <span className={styles.keyword}>const</span>{" "}
          <span className={styles["default"]}>[</span>
          <span className={styles.variable}>count</span>
          <span className={styles["default"]}>, </span>
          <span className={styles.variable}>setCount</span>
          <span className={styles["default"]}>] = </span>
          <span className={styles.function}>useState</span>
          <span className={styles["default"]}>(</span>
          <span className={styles.number}>0</span>
          <span className={styles["default"]}>)</span>
          {"\n  "}
          <span className={styles.comment}>// Ether theme syntax colors</span>
          {"\n  "}
          <span className={styles.keyword}>return</span>{" "}
          <span className={styles["default"]}>&lt;</span>
          <span className={styles.type}>button</span>
          <span className={styles["default"]}>&gt;{"{"}</span>
          <span className={styles.variable}>count</span>
          <span className={styles["default"]}>{"}"}&lt;/</span>
          <span className={styles.type}>button</span>
          <span className={styles["default"]}>&gt;</span>
          {"\n"}
          <span className={styles["default"]}>{"}"}</span>
        </code>
      </pre>
    </div>
  );
}
