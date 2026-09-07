# Release Checklist

[![CI](https://github.com/heyxesha/react-ci-cd-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/heyxesha/react-ci-cd-lab/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/heyxesha/react-ci-cd-lab/actions/workflows/deploy.yml/badge.svg)](https://github.com/heyxesha/react-ci-cd-lab/actions/workflows/deploy.yml)

A small Next.js application for preparing frontend releases. The project is also a practical
example of a complete CI/CD workflow: local quality checks, pull request validation, protected
merges, static export, and automated deployment.

**Live demo:** [heyxesha.github.io/react-ci-cd-lab](https://heyxesha.github.io/react-ci-cd-lab/)

## Features

- seven release preparation steps
- completion tracking and progress calculation
- filters for all, completed, and remaining steps
- checklist reset
- browser persistence with `localStorage`
- responsive and accessible interface

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4 and custom CSS
- Vitest
- React Testing Library
- GitHub Actions
- GitHub Pages

## Getting started

The project uses Node.js 22.19.0, recorded in `.nvmrc`.

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the local Next.js development server           |
| `npm run format`       | Format project files with Prettier                   |
| `npm run format:check` | Check formatting without changing files              |
| `npm run lint`         | Run ESLint                                           |
| `npm run typecheck`    | Generate Next.js route types and check TypeScript    |
| `npm run test`         | Run the component tests once                         |
| `npm run test:watch`   | Run tests continuously while developing              |
| `npm run build`        | Create the production static export in `out`         |
| `npm run check`        | Run formatting, linting, types, tests, and the build |

The same `npm run check` command is used locally and in CI.

## Application architecture

`app/page.tsx` remains a Server Component and provides the static page structure.
`app/release-checklist.tsx` is a Client Component because it uses state, click handlers, and the
browser-only `localStorage` API.

The checklist reads browser storage through React's `useSyncExternalStore`. A separate server
snapshot keeps the prerendered HTML and the first client render consistent.

## Testing

The component tests run with Vitest, React Testing Library, and the `jsdom` browser environment.
They verify:

- the initial checklist and progress;
- completion of a step;
- persistence to `localStorage`;
- filtering of completed items.

## Continuous Integration

The [CI workflow](.github/workflows/ci.yml) runs for pull requests targeting `main` and for pushes
to `main`.

On a clean Ubuntu runner, it:

1. checks out the repository;
2. sets up the Node.js version from `.nvmrc`;
3. installs exact dependency versions with `npm ci`;
4. runs `npm run check`.

The `main` branch is protected by a GitHub ruleset. Pull requests cannot be merged until the
required `Quality checks` job passes. Force pushes and branch deletion are disabled.

## Continuous Deployment

Next.js is configured with `output: "export"`, so the production build creates a static site in
the `out` directory.

The [deployment workflow](.github/workflows/deploy.yml) runs after a push to `main` or when started
manually. It:

1. installs dependencies and runs all quality checks;
2. builds the static site;
3. uploads `out` as a GitHub Pages artifact;
4. deploys the artifact to the `github-pages` environment.

The deployment uses only the required repository permissions: read access to the contents, write
access to Pages, and an identity token for secure deployment.

## Static export limitations

GitHub Pages serves static files and does not run a Node.js server. Features that require a server
at request time are therefore outside this project's scope, including:

- server-side rendering;
- Server Actions;
- dynamic API routes;
- server-side cookies and authentication;
- the default Next.js image optimization service.

This application is suitable for static hosting because all interaction happens in the browser and
the checklist data is stored locally.

## Delivery flow

```text
feature branch
      ↓
pull request
      ↓
CI quality checks
      ↓
protected merge to main
      ↓
static build
      ↓
GitHub Pages deployment
```
