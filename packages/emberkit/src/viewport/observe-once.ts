export interface ObserveOnceOptions {
  rootMargin?: string;
  threshold?: number;
}

export function observeOnce(
  element: Element,
  callback: () => void,
  options: ObserveOnceOptions = {},
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) {
        return;
      }

      observer.disconnect();
      callback();
    },
    {
      rootMargin: options.rootMargin,
      threshold: options.threshold,
    },
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}
