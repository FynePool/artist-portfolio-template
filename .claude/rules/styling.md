---
description: Styling and token rules
paths:
  - "app/**/*.{ts,tsx,css}"
  - "components/**/*.{ts,tsx}"
---

- Use only the semantic tokens defined in `app/globals.css`: `surface`, `ink`, `body`, `muted`, `faint`, `rule`.
- Never use Tailwind built-in color classes (e.g. `text-gray-500`, `bg-white`) — always use token classes.
- Dark mode is handled by `.dark` on `<html>`, not by a media query — do not add `dark:` variants.
- Preserve accessibility contrast when changing colors.
- Avoid arbitrary pixel values; use the existing spacing scale.
