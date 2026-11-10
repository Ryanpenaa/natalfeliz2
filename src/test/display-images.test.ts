import { describe, expect, it } from 'vitest';
import { displayImages } from '@/lib/display-images';
import dimensions from '@/lib/display-image-dimensions.json';

describe('Display-only image variants', () => {
  it('provides CDN copies for all 29 original display images without losing any image', () => {
    expect(Object.keys(dimensions)).toHaveLength(29);
    expect(Object.keys(displayImages).sort()).toEqual(Object.keys(dimensions).sort());
    for (const variants of Object.values(displayImages)) {
      expect(variants.length).toBeGreaterThan(0);
      expect(variants.every(v => v.url.startsWith('/__l5e/assets-v1/'))).toBe(true);
      expect(variants.every(v => v.width > 0 && v.height > 0)).toBe(true);
    }
  });
  it('offers 400, 800 and 1280 pixel principal-image copies for mobile and desktop', () => {
    expect(displayImages['/images/modelos/mk.webp']?.map(v => v.width)).toEqual([400, 800, 1280]);
  });
});