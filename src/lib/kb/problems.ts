// The problems inside one merged ticket, counted the way the desk's own view counts them (CauseTable):
// every report under its cause, by tenant. The reports the desk read as a one-day move (desk-notes.json)
// stay counted where they're filed, and are counted again as a problem of their own: a date one day off
// is not a flipped month.
import { groupByCause, readAs, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // The causes these reports are filed under, and so also counted under. Empty for a cause.
  filedUnder: CauseGroup['cause'][];
};

export type Split = {
  // Rows the export holds for the ticket, repeats included.
  rows: number;
  // One report per id.
  merged: Report[];
  groups: ProblemGroup[];
};

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): Split {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const causes = groupByCause(merged, tenantOf);
  const groups: ProblemGroup[] = causes.map((g) => ({
    problem: g.cause,
    reports: g.reports,
    tenants: g.tenants,
    firstSeen: g.firstSeen,
    lastSeen: g.lastSeen,
    filedUnder: [],
  }));
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const days = moved.map((r) => r.receivedAt.slice(0, 10)).sort();
    groups.push({
      problem: 'one-day',
      reports: moved,
      tenants: new Set(moved.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
      filedUnder: causes.filter((g) => readAs(g, oneDayMove) > 0).map((g) => g.cause),
    });
  }
  return { rows: reports.filter((r) => r.mergedInto === ticket).length, merged, groups };
}
