---
name: setup
description: Create an artist portfolio website from scratch using the FynePool/artist-portfolio-template — check prerequisites (GitHub and Vercel accounts, connectors), create a private repository from the template, create a Vercel project with the chosen name (name.vercel.app), put the site online, then hand off to the guided setup that lives inside the repository (/setup). Use it when the user wants to create, start or publish a new artist portfolio.
---

# New artist portfolio — kickoff

Take the user from nothing to a live site at `NAME.vercel.app` backed by their own private GitHub
repository, then hand over to the full setup, which lives **inside the repository** (`/setup` skill).

**Language:** always reply in the user's language. These instructions are in English; translate any
text you are told to quote (e.g. the Hobby plan notice) into the user's language.
One step at a time.

## Rules

- **No step is skipped.** Keep a todo list with A1–A7. A step is closed only when its
  **verification** (given below) succeeded; note the evidence (e.g. "repo mario/portfolio, private").
- **Confirm before every external action**: creating the repository, creating the Vercel project, commit/push.
- **Accounts and logins belong to the user**: never create accounts, never type passwords or tokens.
  No secret goes through the chat.
- The template is `FynePool/artist-portfolio-template`. The generated website, its admin panel (CMS)
  and the guided setup inside the repository are currently in Italian: say so up front, the user can
  translate the site's texts during the setup.

## A1 — Prerequisites

Present them **all in a single message**, explaining why each is needed, then verify what can be verified.

1. **Who will own the site.** GitHub, Vercel and the CMS login must belong to **the same person**
   (usually the artist). Reason: on Vercel's free plan (Hobby) with a private repository, Vercel only
   deploys changes made by the account owner; if the CMS is used by another GitHub account, site
   updates are blocked. If several people must edit the content, the Pro plan or a public repository
   is needed: say it now, not halfway through.
2. **A personal GitHub account** (not an organization: Hobby does not deploy private organization repositories).
3. **A Vercel account** (free Hobby plan) **linked to the same GitHub account**
   (Vercel → Account Settings → Authentication / Login Connections), with Vercel's GitHub app
   authorized on the repositories (https://github.com/apps/vercel → Configure; "All repositories" is
   simplest, otherwise the new repository is added after it is created).
4. **Hobby plan notice** — convey it with this meaning (in the user's language) and ask them to
   confirm they read it:
   > The Hobby plan is for personal, non-commercial use only. The site can be a **showcase** of the
   > artworks; to advertise or handle their sale (prices, "buy", payments) Vercel requires the Pro
   > plan. The choice is yours.
   > Details: https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage
5. **Claude's access to Vercel**: Vercel connector authorized (claude.ai → Settings → Connectors;
   in Claude Code also `/mcp`), or — in Claude Code on the computer — the Vercel CLI with
   `vercel login` run by the user.
6. **Claude's access to GitHub** (recommended): in Claude Code on the computer, the GitHub CLI with
   `gh auth login` run by the user → Claude creates the repository. Without it, the user clicks
   "Use this template". The GitHub connector is useful but not required.
7. **Where the setup will continue** (requires Claude Code): on the computer (terminal or desktop
   app; recommended when the artwork images are on the computer) or in the cloud at claude.ai/code
   (Pro, Max or Team plan; the Claude GitHub App will be installed on the new repository).
8. Optional: Gmail connector (to fetch the contact form key automatically later in the setup).

Verifications (do the ones available with the present tools, never asking for credentials):
- Vercel: connector → list teams (take the personal team), or `vercel whoami`.
- GitHub: `gh auth status` and `gh api user --jq .login`, or the GitHub connector (current user).
- Single owner: the verified GitHub username must be the one the user signs in to Vercel with and
  will use for the CMS. Ask explicitly and record the answer.

Close A1 only with: Hobby notice confirmed, single owner confirmed, at least one working way to
reach Vercel (connector or CLI). Without Vercel access, stop and explain how to enable it.

## A2 — Site name

Ask for the name (e.g. `mario-rossi`): it becomes the repository name and the address `NAME.vercel.app`.
Rules: lowercase letters, digits, hyphens; starts with a letter; at most 40 characters.

Check availability:
- GitHub: `gh repo view OWNER/NAME` must fail with "not found" (or connector: repository doesn't exist).
- Vercel: send an HTTP HEAD request to `NAME.vercel.app` (https): a `404` response with header
  `x-vercel-error: DEPLOYMENT_NOT_FOUND` ⇒ free; `200` ⇒ taken, suggest alternatives (`NAME-art`,
  `NAME-studio`…). If you can't make HTTP requests, confirmation comes in A4 (domain actually assigned).

## A3 — Private repository from the template

**Done by Claude (GitHub CLI):**

```bash
gh repo create OWNER/NAME --template FynePool/artist-portfolio-template --private
# copying from a template is asynchronous: wait until the files are available (retry for ~30 s)
gh api repos/OWNER/NAME/contents/package.json --jq .name
```

**Step by step (without GitHub CLI):** the user opens
https://github.com/FynePool/artist-portfolio-template/generate → Owner: their account →
Repository name: `NAME` → **Private** → **Create repository**, then confirms.

Verification: the repository exists, is **private** (`gh repo view OWNER/NAME --json visibility` →
`PRIVATE`, or connector, or the user confirms from the repository page) and contains `package.json`.

If the user will continue **on the computer** and you have a shell: ask for the destination folder
(e.g. `~/Documents`) and clone `OWNER/NAME` into `FOLDER/NAME` with the GitHub CLI (or git).
Then, in the cloned folder, set the commit author to the owner's GitHub account (Vercel Hobby
requirement, see A1). Read login, display name and numeric ID with
`gh api user --jq '.login, .name, .id'` (without the CLI: ask the user) and write them to the
repository's **local** config:

```bash
git config user.name "DISPLAY NAME"
git config user.email "ID+LOGIN@users.noreply.github.com"
```

## A4 — Vercel project with the chosen name

**Done by Claude (Vercel connector):** find the personal team (list teams), then create the project
linked to the repository with `projectName` = `NAME` and repo `OWNER/NAME` (the tool that creates a
project from a Git repository). If the error says Vercel can't see the repository: the user opens
https://github.com/apps/vercel → Configure → adds `NAME` → retry.

**Done by Claude (Vercel CLI, in the cloned folder):**

```bash
vercel link --yes --project NAME
vercel git connect
```

**Step by step (dashboard):** https://vercel.com/new → import the repository → Project Name `NAME` → Deploy.

Verification: the project exists and is linked to `OWNER/NAME`; read the project's domains. If the
assigned domain isn't `NAME.vercel.app` (name already taken), say so and offer: keep it, or add
another free `*.vercel.app` domain to the project.

## A5 — First commit: configuration, step log, plugin removal

The new repository needs three changes, in **a single commit** on `main` (this push also starts the
first production deployment):

1. `public/admin/config.yml` → `backend.repo: OWNER/NAME`.
2. Remove the plugin files, which the artist's repository doesn't need: the `plugin/` folder and
   `.claude-plugin/marketplace.json`.
3. Create `setup-progress.md` by copying `.claude/skills/setup/progress-template.md` and closing with
   `[x]` plus evidence **only** the steps verified here: 0.3, 0.4 (Hobby notice confirmed and single
   owner), 0.5 and 0.6 (tools verified), 1.1, 1.2, 1.3, 3.1, 3.2, 3.3 (write the URL), 3.4 (after A6).
   Everything else stays `[ ]`. The file's labels are in Italian: keep them as they are.

How:
- **With the cloned folder**: edit the files, then `git add -A`, `git commit -m "Kickoff: configure repo, setup log, remove plugin"` and `git push`.
- **Without a clone** (e.g. Claude in chat or Cowork): use the GitHub connector to create/update and
  delete the files directly on `main`. If it isn't available, leave these steps to `/setup` (they
  stay `[ ]` in the log: 1.2 and 1.3 are done by `/setup-repo`) and the first production deployment
  will start at the setup's first push.

## A6 — Site online

Wait until the production deployment is **Ready** (connector: the project's deployment list; CLI:
`vercel ls`). Check that `NAME.vercel.app` answers 200 (HTTP HEAD request, or the connector's tool
that reads a Vercel URL, or the user opens it). The site still shows the sample content: that's
expected, it is replaced during the setup. Update 3.4 in the log (separate commit if needed).

## A7 — Handoff to the full setup

The rest (content, CMS, contact form, domain) is guided by the `/setup` skill inside the repository.
A repository's skills only load in a session **opened on that repository**: this session can't see
them, so a new session is needed. Give the user the instructions for the path chosen in A1:

- **On the computer:** open the folder `FOLDER/NAME` in Claude Code — from a terminal, move into the
  folder and start Claude Code; from the desktop app: Code tab → new session → pick the folder —
  then type `/setup`. If the repository isn't on the computer yet, clone it first as in A3.
- **In the cloud:** install the Claude GitHub App on the repository (https://github.com/apps/claude →
  Configure → add `NAME`), open https://claude.ai/code, start a session on `OWNER/NAME`, enable the
  Vercel connector for the session and type `/setup`. In the cloud, artwork images are uploaded
  later from the CMS and browser steps (e.g. creating the GitHub OAuth App) are done by the user
  following the instructions.

End with a summary: repository URL (private), site URL, steps already logged as done, next action
(`/setup`, which resumes from step 0.1/0.2 and then the content, 2.1).
