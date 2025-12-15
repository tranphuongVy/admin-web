export function calcTotalPages(total: number, limit: number) {
  return Math.ceil(total / limit);
}
