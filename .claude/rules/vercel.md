---
description: Vercel deployment rules
paths:
  - "package.json"
  - "next.config.*"
  - ".env*"
  - "app/**"
---

- No `vercel.json` — rely on Next.js framework conventions.
- Never commit real secret values.
- Run `npm run build` locally before deploy-sensitive changes.
- If env var usage changes, document which variables are needed and in which environments.
- Preview and Production are separate environments; env var changes require a new deployment.
