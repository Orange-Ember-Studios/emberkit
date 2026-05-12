# Image Optimization

EmberKit provides built-in image optimization with automatic format conversion, responsive sizing, and lazy loading.

## Image Plugin

Enable the image plugin in your Vite config:

```typescript
import { defineConfig } from 'vite';
import { createImageVitePlugin } from '@emberkit/core';

export default defineConfig({
  plugins: [
    createImageVitePlugin({
      quality: 80,
      formats: ['webp', 'jpeg'],
      sizes: [320, 640, 1024, 1920],
      lazy: true,
      placeholder: 'blur',
    }),
  ],
});
```

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `quality` | 80 | Image quality (1-100) |
| `formats` | `['webp', 'jpeg']` | Output formats |
| `sizes` | `[320, 640, 1024, 1920]` | Responsive breakpoints |
| `lazy` | true | Enable lazy loading |
| `placeholder` | `'blur'` | Placeholder type |

## Lazy Loading

Images load lazily by default:

```tsx
function Gallery() {
  return (
    <img
      src="/images/photo.jpg"
      alt="A beautiful scene"
      loading="lazy"
      decoding="async"
    />
  );
}
```

## Blur Placeholders

Show a blurred placeholder while the image loads:

```tsx
// The image processor generates blur placeholders automatically
<img
  src="/images/hero.jpg"
  alt="Hero image"
  style={{
    backgroundImage: 'url(data:image/jpeg;base64,...)',
    backgroundSize: 'cover',
  }}
/>
```

## Responsive Images

Generate multiple sizes for different viewports:

```html
<picture>
  <source
    srcset="/images/photo-320.webp 320w, /images/photo-640.webp 640w, /images/photo-1024.webp 1024w"
    type="image/webp"
  />
  <source
    srcset="/images/photo-320.jpg 320w, /images/photo-640.jpg 640w, /images/photo-1024.jpg 1024w"
    type="image/jpeg"
  />
  <img src="/images/photo-640.jpg" alt="Photo" loading="lazy" />
</picture>
```

## Custom Providers

Configure external image providers:

```typescript
createImageVitePlugin({
  provider: 'cloudinary',
  baseUrl: 'https://res.cloudinary.com/mycloud',
});
```

## Next Steps

- [Edge Deployment](/docs/edge) - Optimize for edge delivery
- [Components](/docs/components) - Image component patterns
- [SSR](/docs/ssr) - Server-rendered images
