type HighlightTask = {
  run: () => Promise<string>;
  resolve: (html: string) => void;
  reject: (error: unknown) => void;
};

const cache = new Map<string, string>();
const queue: HighlightTask[] = [];
let active = 0;
const MAX_CONCURRENT = 2;

function drainQueue() {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    const task = queue.shift();
    if (!task) return;

    active += 1;
    task
      .run()
      .then((html) => {
        task.resolve(html);
      })
      .catch((error) => {
        task.reject(error);
      })
      .finally(() => {
        active -= 1;
        drainQueue();
      });
  }
}

export function getCachedHighlight(key: string) {
  return cache.get(key);
}

export function setCachedHighlight(key: string, html: string) {
  cache.set(key, html);
}

export function enqueueHighlight(key: string, run: () => Promise<string>) {
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);

  return new Promise<string>((resolve, reject) => {
    queue.push({
      run: async () => {
        const cachedAgain = cache.get(key);
        if (cachedAgain) return cachedAgain;
        const html = await run();
        cache.set(key, html);
        return html;
      },
      resolve,
      reject,
    });
    drainQueue();
  });
}

export function buildHighlightCacheKey(
  themeId: string,
  language: string,
  code: string,
) {
  return `${themeId}\u0000${language}\u0000${code}`;
}
