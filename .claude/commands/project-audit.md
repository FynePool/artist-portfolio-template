---
name: project-audit
description: Read-only technical audit of the project.
---

Perform a read-only audit. Do not edit files.

Inspect:
- `package.json`, lockfile, package manager
- framework config (`next.config.*`)
- folder structure and routing
- styling approach and token usage
- env var usage
- build/lint/typecheck scripts
- obvious duplication or dead code
- accessibility and SEO basics
- error/loading/empty state coverage

Return:

1. **Stack summary** — framework, language, styling, deployment
2. **Commands** — install, dev, lint, typecheck, build
3. **Architecture map** — routes, components, data fetching, shared utilities
4. **Risks** — classified as blocking / high / medium / low
5. **Recommended next actions** — numbered, small, safe
