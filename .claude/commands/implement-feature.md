---
name: implement-feature
description: Implement a feature with minimal diff and controlled workflow.
---

Workflow:

1. Restate the requested behavior in concrete terms.
2. Identify files involved.
3. Produce a short plan and wait for approval if the change is non-trivial.
4. Implement the smallest safe change.
5. Run the cheapest relevant check (`npm run lint`, then `npx tsc --noEmit` if types changed).

Rules:
- Do not rewrite unrelated code.
- Do not redesign UI unless requested.
- Do not add dependencies unless clearly justified.
- Do not invent APIs or env vars.
- Prefer existing patterns (tokens in `app/globals.css`, data in `data/*.json` and `public/assets/**`).
- Keep the diff reviewable.
