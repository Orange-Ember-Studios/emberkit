---
"@emberkit/cli": patch
---

Update all project templates to use createSignal() API instead of deprecated signal(). This fixes reactivity patterns in SaaS (pricing toggle), Dashboard (sidebar/search/settings), and With-UI templates.
