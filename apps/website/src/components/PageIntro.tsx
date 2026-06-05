import type { ReactNode } from "react";
import styles from "./PageIntro.module.scss";

type PageIntroProps = {
  kicker?: string;
  title: string;
  children: ReactNode;
};

export function PageIntro({ kicker, title, children }: PageIntroProps) {
  return (
    <header className={styles.intro}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>{children}</div>
    </header>
  );
}
