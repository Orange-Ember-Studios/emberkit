# View Transitions Implementation Guide

## Overview

The view transitions have been implemented using the **View Transitions API** (native browser API) combined with a custom `useNavigate` hook that automatically enables view transitions for all navigation.

## What Was Changed

### 1. **Created Custom Navigate Hook** (`src/hooks/useNavigate.ts`)
- Wraps the core `navigate` function from `@emberkit/core`
- Automatically enables `viewTransition: true` for all navigation calls
- Allows opt-out via `skipTransition` option if needed

```typescript
export function useNavigate() {
  return async (path: string, options: UseNavigateOptions = {}) => {
    const { skipTransition = false, ...navigationOptions } = options;
    
    return coreNavigate(path, {
      ...navigationOptions,
      viewTransition: skipTransition ? false : true,
    });
  };
}
```

### 2. **Updated Navigation Calls**
All components now use the custom hook:
- **Header** (`src/components/header.tsx`) - Navigation links and logo
- **Sidebar** (`src/components/sidebar.tsx`) - Documentation links
- **Home Page** (`src/routes/index.tsx`) - CTA buttons

### 3. **View Transition CSS** (`src/styles/globals.css`)
- `::view-transition-old(root)` - Fades out old content
- `::view-transition-new(root)` - Fades in new content
- Duration: 0.3s with ease-in-out timing

## How It Works

### Browser Flow
1. User clicks navigation link
2. `useNavigate()` is called with the target path
3. The navigate function calls `document.startViewTransition()`
4. Browser captures the old DOM state
5. Router updates the page content
6. Browser plays fade-out animation on old content
7. Browser plays fade-in animation on new content
8. Navigation complete with smooth visual transition

### Timeline
```
Click → Navigate Called (0ms)
     ↓
  Capture Old DOM (0-50ms)
     ↓
  Update Content (50-100ms)
     ↓
  Fade Out Animation (100-400ms)
     ↓
  Fade In Animation (100-400ms in parallel)
```

## Testing View Transitions

### Setup
1. Start the dev server:
```bash
cd apps/docs
pnpm dev
```

2. Open browser DevTools (F12)
3. Go to Chrome DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion

### Test Scenarios

#### ✅ Navigation Links
1. Click on "Docs", "API", or "Examples" in header
2. Observe smooth fade transition between pages
3. The page fades out, content updates, then fades in

#### ✅ Sidebar Navigation
1. Scroll down to see sidebar (if not visible)
2. Click any documentation link in the sidebar
3. Observe smooth fade transition with slight scale shift

#### ✅ Logo Navigation
1. Click the EmberKit logo in header
2. Returns to home with smooth transition

#### ✅ CTA Buttons
1. On home page, click "Get Started" button
2. Navigate to /docs/introduction with smooth transition
3. Click "View API" button
4. Navigate to /docs/api with smooth transition

#### ✅ Quick Start Button
1. Scroll to bottom of home page
2. Click "Read the Quick Start"
3. Navigate to /docs/quick-start with smooth transition

## Performance Considerations

### Animation Duration
- Current: 0.3 seconds (300ms)
- Perceived as smooth but not sluggish
- Can be adjusted in globals.css if needed

### Browser Support
- **Supported**: Chrome 111+, Edge 111+
- **Fallback**: Instant navigation (no visual transition)
- **No JS errors** on unsupported browsers

### Disabled Motion
Users with `prefers-reduced-motion` will see instant navigation (browser handles this automatically).

## Troubleshooting

### Transitions Not Visible
1. Check browser console for errors: `Ctrl+Shift+J` or `Cmd+Option+J`
2. Verify browser supports View Transitions API
3. Check network tab - page should load quickly
4. Try different navigation routes

### Transitions Too Fast/Slow
Edit `src/styles/globals.css`:
```css
@keyframes fade-out {
  /* Change duration from 0.3s to desired value */
}
@keyframes fade-in {
  /* e.g., 0.5s for slower, 0.15s for faster */
}
```

### Specific Component Not Transitioning
Make sure it's using the custom hook:
```typescript
import { useNavigate } from '../hooks/useNavigate';

const Component = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/path')} />;
};
```

## Files Modified

```
apps/docs/
├── src/
│   ├── hooks/
│   │   └── useNavigate.ts         (NEW)
│   ├── components/
│   │   ├── header.tsx             (UPDATED)
│   │   └── sidebar.tsx            (UPDATED)
│   ├── routes/
│   │   └── index.tsx              (UPDATED)
│   └── styles/
│       └── globals.css            (UPDATED)
```

## Key Implementation Details

### Why `document.startViewTransition()`?
The framework's navigate function supports the View Transitions API internally:
- It calls `document.startViewTransition()` when `viewTransition: true`
- This is handled in `packages/emberkit/src/navigation/helpers/navigation.ts`
- Our hook simply enables this feature by default

### Why a Custom Hook?
- Simplifies the API - no need to pass options every time
- Consistent behavior across the app
- Easy to disable transitions on specific navigations
- Centralized location for navigation logic

## Next Steps

1. **Test on different browsers** to verify cross-browser compatibility
2. **Monitor performance** - ensure transitions don't impact load time
3. **Gather feedback** from users about transition speed/feel
4. **Consider adding more sophisticated transitions** per page/route if desired
5. **Test with slow 3G** to ensure transitions work on slow connections

## Related Documentation

- [View Transitions API MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Chrome DevTools - Emulate CSS Media](https://developer.chrome.com/docs/devtools/rendering/emulate-css-media-feature-prefers-reduced-motion/)
- [EmberKit Navigation Module](../../packages/emberkit/src/navigation/)
