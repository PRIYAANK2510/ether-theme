import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  rootMargin?: string;
  once?: boolean;
};

export function useInView<T extends Element>({
  rootMargin = "240px 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || (once && inView)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, once, rootMargin]);

  return { ref, inView };
}
