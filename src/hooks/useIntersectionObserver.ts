import { useEffect, useRef, useState, MutableRefObject } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
    };
  }, [options]);

  return { targetRef, isIntersecting };
}
