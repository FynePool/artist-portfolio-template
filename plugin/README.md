# Artist Portfolio

Create an artist's portfolio website from scratch, starting from the open-source template
[FynePool/artist-portfolio-template](https://github.com/FynePool/artist-portfolio-template):
artwork galleries, exhibitions, biography, a contact form and an `/admin` panel to update the
content without touching code.

## How to use it

Type `/artist-portfolio:setup` (or ask Claude to create a new artist portfolio). Claude:

1. lists and checks the prerequisites: a personal GitHub account, a Vercel account linked to the
   same GitHub account, Claude's access to Vercel (connector or CLI), and a notice about the
   limits of Vercel's free Hobby plan;
2. lets you choose the site name, which becomes the repository name and the address `name.vercel.app`;
3. creates your **private** repository from the template (with the GitHub CLI, or guides you to the
   "Use this template" button);
4. creates the Vercel project linked to the repository and puts the site online;
5. makes the first configuration commit and explains how to continue with `/setup` inside the
   repository, on your computer or in Claude Code on the web.

Every action on external accounts (creating repositories or projects, commits) starts only after
you confirm it. Claude replies in your language.

**Language note:** the generated website, its admin panel and the guided setup inside the
repository are currently in Italian. You can translate the site's texts during the setup.

## Services and data involved

The plugin only contains instructions for Claude (one skill): no server, script or executable code.
Claude acts through the tools **you** have already connected:

- **GitHub** (GitHub CLI or connector): reads your username, creates a repository from the template in your account, commits to the new repository.
- **Vercel** (connector or CLI): reads your teams and projects, creates a project linked to the repository, checks deployment status.
- **Network**: read-only HTTP requests to `name.vercel.app` to check that the name is available and that the site is online.

If you choose to, the later setup inside the repository can also use the Gmail connector (to read
the email containing the contact form key) and the browser (to fill in non-secret fields).

The plugin sends no data to other services, never asks for or stores passwords, tokens or secrets,
and never creates accounts on your behalf.

## Requirements

- A personal GitHub account and a Vercel account (the free Hobby plan is fine for a non-commercial showcase site).
- Claude Code (terminal, desktop app or web) for the full setup after the kickoff.

MIT License · [Privacy](PRIVACY.md) · [Support](https://github.com/FynePool/artist-portfolio-template/issues)
