# View Transitions Testing Checklist

## Quick Start Testing

Run the development server:
```bash
cd apps/docs
pnpm dev
```

Then open `http://localhost:5173` in your browser.

## Test Cases

### Header Navigation
- [ ] Click "Docs" - observe fade transition
- [ ] Click "API" - observe fade transition
- [ ] Click "Examples" - observe fade transition
- [ ] Click EmberKit logo - return to home with transition

### Sidebar Navigation
- [ ] Click "Introduction" in sidebar
- [ ] Click "Installation" in sidebar
- [ ] Click "Quick Start" in sidebar
- [ ] Click "Components" in Core Concepts
- [ ] Click any Advanced topic

### Home Page CTAs
- [ ] Click "Get Started" button → goes to /docs/introduction
- [ ] Click "View API" button → goes to /docs/api
- [ ] Click "Read the Quick Start" at bottom → goes to /docs/quick-start

### Browser Compatibility
- [ ] Test in Chrome 111+
- [ ] Test in Edge 111+
- [ ] Test in Firefox (should show instant navigation)
- [ ] Test in Safari (should show instant navigation)

### Accessibility
- [ ] In DevTools, enable "Emulate CSS media feature prefers-reduced-motion"
- [ ] Verify navigation still works (should be instant, no transition)
- [ ] Confirm no layout shifts or visual glitches

### Performance
- [ ] Check Network tab - verify no extra requests during transition
- [ ] Check Console - verify no JavaScript errors
- [ ] Test with slow 3G (DevTools → Network → Slow 3G)
- [ ] Verify transitions still appear smooth on slow connection

### Visual Quality
- [ ] Transition should be subtle fade (0.3 seconds)
- [ ] Content should not flicker
- [ ] No layout shift when new page loads
- [ ] Smooth opacity change from 0 to 1

## Common Issues & Solutions

### Transitions Not Visible
- ✓ Verify browser supports View Transitions API (Chrome/Edge 111+)
- ✓ Check Console for errors (F12)
- ✓ Ensure navigation actually changes the URL
- ✓ Clear browser cache (Ctrl+Shift+Delete)

### Transitions Too Abrupt
- ✓ Check that animations are defined in globals.css
- ✓ Verify fade-in/fade-out keyframes exist
- ✓ Check animation duration (currently 0.3s)

### Page Content Flashing
- ✓ Verify router is properly updating content
- ✓ Check for CSS conflicts that might show/hide content
- ✓ Ensure background color is set on body

## Success Criteria

✅ All navigation links trigger view transitions
✅ Transitions are smooth and not jarring
✅ Page content updates correctly
✅ No console errors during navigation
✅ Works in modern browsers (Chrome, Edge)
✅ Gracefully degrades in unsupported browsers
✅ Respects prefers-reduced-motion preference
✅ No performance degradation

## Recording Transitions

To capture transitions for demo/sharing:

### Using Chrome DevTools
1. Open DevTools (F12)
2. Go to Console tab
3. Run: `await new Promise(r => setTimeout(r, 1000))` and then navigate
4. Use Chrome's built-in screen recording (or OBS)

### Using External Tool
1. Use [ScreenFlow](https://www.screenflow.com/) (Mac)
2. Use [OBS Studio](https://obsproject.com/) (Cross-platform)
3. Record at 60fps for smooth playback

## Notes

- Current transition timing: **0.3 seconds**
- Animation easing: **ease-in-out** for smooth natural feel
- API used: **Document View Transitions API**
- Fallback behavior: **Instant navigation** (no error)
- Accessibility: **Respects prefers-reduced-motion** automatically

## See Also

- [VIEW_TRANSITIONS.md](./VIEW_TRANSITIONS.md) - Implementation details
- [Developer Guide](../../AGENTS.md) - Framework conventions
