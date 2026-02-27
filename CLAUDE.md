# Base - Project Guidelines

## What is this?

This is a sandbox website project hosted at **base.nikolai.vip** via Netlify.
Netlify auto-deploys from the `main` branch. The owner (Nikolai) will request
websites to be built here, and Claude will implement them.

## Stack

- **Framework:** Astro (with TypeScript, strict mode)
- **Adapter:** @astrojs/netlify (supports static pages + serverless functions)
- **Hosting:** Netlify (auto-deploy from `main`)
- **Output mode:** Static by default (`output: 'static'` in astro.config.mjs)
  - Switch to `output: 'server'` or `output: 'hybrid'` if server-side rendering
    or Netlify Functions are needed for a specific project

## Project Structure

```
src/
  pages/        # File-based routing (.astro, .md, .ts for API routes)
  layouts/      # Reusable page layouts
  components/   # Reusable UI components
  styles/       # Global styles (if needed)
public/         # Static assets (images, fonts, favicon)
netlify/
  functions/    # Netlify serverless functions (if needed)
```

## Conventions

- **Design:** Clean, functional, minimal. No unnecessary decoration.
- **Content:** Always hardcoded (no CMS, no external data fetching for content).
- **Styling:** Use scoped `<style>` tags in Astro components. Add a CSS framework
  only if the project calls for it.
- **TypeScript:** Strict mode. Use types where they add clarity.
- **Components:** Keep components small and focused. Use Astro components unless
  client-side interactivity is needed (then add React/Svelte via `astro add`).

## Workflow: New Website Request

When Nikolai asks for a **new** website (replacing the current one):

1. Create a new branch from `main` named after the current site (e.g., `archive/site-name`)
2. Push the archive branch
3. Reset `main` to a clean state with the new project
4. Commit and push to `main` — Netlify will auto-deploy

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build
npm run preview   # Preview production build locally
```

## Deployment

Push to `main` and Netlify handles the rest. No manual deploy steps needed.

## Astro Scoped CSS Gotcha

**Scoped styles don't apply to JS-generated DOM elements.**
Astro's `<style>` block rewrites selectors to `selector[data-astro-cid-xxx]`. Only elements
in the static template receive that attribute. Any elements created via `document.createElement`
at runtime never get it, so scoped CSS rules silently don't match them.

For styles that target JS-generated elements, use `<style is:global>` (or inline styles in the JS).

## MDX Gotchas

**Tables with dynamic rows must use JSX, not markdown pipe syntax.**
In MDX, JS expressions are evaluated and their output is inserted as text nodes —
the result is never re-parsed as markdown. So this is broken:

```mdx
| Rank | Name |
|------|------|
{rows.map(r => `| ${r.rank} | ${r.name} |`).join('\n')}
```

The JS expression renders as a literal string with `|` characters, not as `<tr>` elements.
Always write dynamic tables as JSX:

```mdx
<table>
  <thead><tr><th>Rank</th><th>Name</th></tr></thead>
  <tbody>
    {rows.map(r => <tr><td>{r.rank}</td><td>{r.name}</td></tr>)}
  </tbody>
</table>
```
