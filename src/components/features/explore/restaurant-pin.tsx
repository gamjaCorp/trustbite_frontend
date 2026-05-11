import type { VisitStatus } from '@/types/restaurant';

interface Props {
  status: VisitStatus;
  active?: boolean;
  rank?: number;
}

export function buildPinHtml({ status, active = false, rank }: Props): string {
  const isTop3 = typeof rank === 'number' && rank <= 3;
  const baseSize = isTop3 ? 34 : 28;
  const size = active ? baseSize + 4 : baseSize;
  const isVisited = status === 'visited' || status === 'reviewed';
  const ring = active
    ? 'box-shadow: 0 0 0 3px rgba(255,122,0,0.25), 0 4px 8px rgba(0,0,0,0.2);'
    : 'box-shadow: 0 2px 6px rgba(0,0,0,0.18);';
  const bg = isTop3 ? '#FF7A00' : '#A3573B';
  const fontSize = isTop3 ? size * 0.5 : size * 0.45;

  const label =
    typeof rank === 'number'
      ? `<span style="color:#fff;font-weight:800;font-size:${fontSize}px;font-family:'JetBrains Mono',ui-monospace,monospace;line-height:1;">${rank}</span>`
      : `<svg width="${size * 0.45}" height="${size * 0.45}" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>`;

  const check = isVisited
    ? `<span style="position:absolute;right:-2px;top:-2px;width:14px;height:14px;border-radius:9999px;background:#22C55E;border:2px solid #fff;display:flex;align-items:center;justify-content:center;">
         <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
       </span>`
    : '';

  return `
    <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
      <div style="width:${size}px;height:${size}px;border-radius:9999px;background:${bg};border:3px solid #fff;${ring}display:flex;align-items:center;justify-content:center;">
        ${label}
      </div>
      ${check}
    </div>
  `;
}
