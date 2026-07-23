// 순위(1/2/3위) → 메달 색상 + shine 클래스 도메인 매핑
export function getRankMedalClasses(rank: number): string | null {
  if (rank === 1) return 'bg-palette-gold text-white badge-shine';
  if (rank === 2) return 'bg-palette-silver text-white badge-shine';
  if (rank === 3) return 'bg-palette-bronze text-white badge-shine';
  return null;
}
