// 정수면 소수점 없이, 아니면 소수점 1자리로 포맷 (예: 3 → "3", 3.5 → "3.5")
export function formatDelta(value: number): string {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
}
