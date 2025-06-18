export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  // Flatten all downtime logs into a single array
  const allPeriods: [Date, Date][] = args.flat();

  if (allPeriods.length === 0) {
    return [];
  }

  // Sort periods by start time
  allPeriods.sort((a, b) => a[0].getTime() - b[0].getTime());

  const merged: [Date, Date][] = [];
  let current = allPeriods[0];

  for (let i = 1; i < allPeriods.length; i++) {
    const next = allPeriods[i];

    // Check if current period overlaps with next period
    if (current[1].getTime() >= next[0].getTime()) {
      // Merge overlapping periods
      current = [
        current[0],
        new Date(Math.max(current[1].getTime(), next[1].getTime())),
      ];
    } else {
      // No overlap, add current to result and move to next
      merged.push(current);
      current = next;
    }
  }

  // Add the last period
  merged.push(current);

  return merged;
}
