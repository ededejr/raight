export function groupBy<T>(arr: T[], fn: (a: T) => string) {
  return arr
    .map(typeof fn === "function" ? fn : (val) => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {} as Record<string, T[]>);
}
