# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## This copy

The export above, with one page added: #4471 split into one ticket per problem.

- The page: `src/routes/kb/incidents/4471/split/+page.svx`. Its numbers come from
  `src/lib/kb/ProblemTable.svelte` and `src/lib/kb/problems.ts`.
- The page as the desk will see it: `rendered/kb/incidents/4471/split.html`, the prerendered output
  of `npm run build` (`build/kb/incidents/4471/split.html`).
- The tickets: the issues in this repo, one per problem.
- The export ships `src/` only. `package.json`, `svelte.config.js`, `vite.config.js`,
  `src/app.html` and `src/routes/+layout.js` are added so it builds: `npm ci && npm run build`.
