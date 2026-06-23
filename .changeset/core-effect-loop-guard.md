---
"@emberkit/core": patch
---

add runtime guard in createEffect that throws after more than 100 synchronous re-runs of the same effect chain, detecting "effect reads the signal it writes" infinite loops before they cause a stack overflow
