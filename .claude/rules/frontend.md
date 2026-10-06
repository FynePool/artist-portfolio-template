---
description: Frontend component rules
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
---

- Keep components small and focused.
- Extract repeated UI patterns only when repetition is real.
- Preserve existing props contracts unless the task requires changing them.
- Use semantic HTML.
- Avoid client-side state where server/rendered data is enough.
- Check responsive behavior (mobile and desktop).
