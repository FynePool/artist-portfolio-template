---
name: review-before-deploy
description: Pre-deploy review for Vercel: diff, build, regressions, env vars, risks.
---

Steps:

1. Run `git status` and review changed files.
2. Identify user-facing and deployment-sensitive changes.
3. Check for env var additions or removals.
4. Run: `npm run lint`, then `npx tsc --noEmit`, then `npm run build`.
5. Report deploy readiness.

Output:

- **Deploy readiness:** ready / not ready / ready with risks
- **Changed areas**
- **Commands run and their outcome**
- **Blocking issues**
- **Non-blocking issues**
- **Suggested deploy command** (`vercel deploy` or `vercel deploy --prod`)
