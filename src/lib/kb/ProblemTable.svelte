<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { splitTicket, type Problem } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  // tickets: where each problem is filed, as a link; a problem without one is highlighted.
  // states: what became of each ticket. A problem with no state is open.
  let {
    ticket,
    tickets = {},
    states = {},
  }: { ticket: number; tickets?: Partial<Record<Problem, string>>; states?: Partial<Record<Problem, string>> } = $props();

  const WHAT: Record<Problem, string> = {
    parser: 'day and month swapped: the shared parser reads every date month first',
    hint: 'day and month swapped: the booking-v3 form hint asks for the month first',
    'one-day': 'date moved by one day, not swapped',
    unplaced: 'no cause: tenant not on file, or it writes the month first',
  };

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const repeats = $derived(split.rows - split.merged.length);
  // https://github.com/owner/repo/issues/7 → owner/repo#7
  const label = (href: string) => href.replace(/^https:\/\/github\.com\//, '').replace('/issues/', '#');
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{split.groups.length}</strong>
  {split.groups.length === 1 ? 'problem' : 'problems'}
</p>
{#if repeats}
  <p class="note">The export holds {split.rows} rows for #{ticket}: {repeats} reports come twice. Each is counted once.</p>
{/if}

<table>
  <thead>
    <tr><th>problem</th><th>what goes wrong</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th><th>state</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      {@const href = tickets[g.problem]}
      <tr class:open={!href}>
        <td><code>{g.problem}</code></td>
        <td>{WHAT[g.problem]}</td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if href}<a {href}>{label(href)}</a>{:else}no ticket yet{/if}</td>
        <td class:still={!states[g.problem]}>{states[g.problem] ?? 'open'}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.groups as g (g.problem)}
  {#if g.filedUnder.length}
    <p class="note">
      The {g.reports.length} <code>{g.problem}</code> reports are also counted under
      {#each g.filedUnder as cause, i (cause)}{i ? ', ' : ''}<code>{cause}</code>{/each}, where the desk files them by tenant.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:nth-last-child(2) { color: var(--warn); font-weight: 600; }
  .still { color: var(--warn); font-weight: 600; }
</style>
