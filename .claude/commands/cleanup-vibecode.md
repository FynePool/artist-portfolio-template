---
name: cleanup-vibecode
description: Safe cleanup of messy or duplicated code without changing behavior.
---

Start read-only. Inspect the requested area and classify issues:

- duplication
- oversized components
- unclear naming
- dead code
- inconsistent token usage
- missing loading/error/empty states
- weak typing
- accessibility problems

Refactor policy:
- Preserve behavior and visual appearance.
- One refactor category at a time.
- Prefer extraction over rewrite.
- Keep public props stable unless explicitly approved.
- After refactor, run `npm run lint` and `npx tsc --noEmit`.

Return first:
1. **Cleanup map**
2. **Safe quick wins**
3. **Risky changes requiring approval**

Only edit after the user approves.
