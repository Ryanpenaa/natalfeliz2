import { memo, useEffect, useRef, useState, type ImgHTMLAttributes, type RefObject } from 'react';
import { displayImages } from '@/lib/display-images';
import originalDimensions from '@/lib/display-image-dimensions.json';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  deferred?: boolean;
  enabled?: boolean;
  scrollRoot?: RefObject<HTMLDivElement | null>;
};

// Keep the original aspect ratio before downloading, and attach URLs only near view.
export const DisplayImage = memo(function DisplayImage({ src, deferred = false, enabled = true, scrollRoot, sizes, ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(!deferred);
  const variants = displayImages[src.split('?')[0] ?? src];
  const dimensions = (originalDimensions as Record<string, { width: number; height: number }>)[src.split('?')[0] ?? src];
  useEffect(() => {
    const node = ref.current;
    if (ready || !enabled || !node) return;
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { root: scrollRoot?.current ?? null, rootMargin: scrollRoot ? '0px 100%' : '300px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready, enabled, scrollRoot]);
  const largest = variants?.at(-1);
  const fallback = variants?.find(variant => variant.width >= 800) ?? largest;
  return <img {...props} ref={ref} width={dimensions?.width ?? props.width} height={dimensions?.height ?? props.height}
    src={ready ? fallback?.url ?? src : undefined}
    srcSet={ready ? variants?.map(variant => `${variant.url} ${variant.width}w`).join(', ') : undefined}
    sizes={sizes} decoding={props.fetchPriority === 'high' ? 'auto' : 'async'} />;
});