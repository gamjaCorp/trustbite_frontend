// /signin 배경에 떨어지는 포크/스푼 비 이펙트
function Fork({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2v7M12 2v7M16 2v7M8 9c0 2.2 1.8 4 4 4s4-1.8 4-4M12 13v9" />
    </svg>
  );
}

function Spoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="7" rx="4" ry="5" />
      <line x1="12" y1="12" x2="12" y2="22" />
    </svg>
  );
}

const ICON_MAP = { fork: Fork, spoon: Spoon } as const;

const RAIN_ITEMS = [
  { type: 'fork',  left: '5%',  delay: '0s',    duration: '7s',   scale: 1.4, opacity: 0.7 },
  { type: 'spoon', left: '14%', delay: '1.2s',   duration: '8s',   scale: 1.0, opacity: 0.35 },
  { type: 'fork',  left: '24%', delay: '0.4s',   duration: '6s',   scale: 1.2, opacity: 0.35 },
  { type: 'fork',  left: '35%', delay: '2s',     duration: '9s',   scale: 0.9, opacity: 0.7 },
  { type: 'spoon', left: '47%', delay: '0.8s',   duration: '7.5s', scale: 1.3, opacity: 0.35 },
  { type: 'spoon', left: '58%', delay: '3s',     duration: '8.5s', scale: 1.0, opacity: 0.7 },
  { type: 'fork',  left: '68%', delay: '1.5s',   duration: '6.5s', scale: 1.1, opacity: 0.35 },
  { type: 'spoon', left: '78%', delay: '0.2s',   duration: '9s',   scale: 0.85, opacity: 0.7 },
  { type: 'fork',  left: '88%', delay: '2.5s',   duration: '7s',   scale: 1.2, opacity: 0.35 },
  { type: 'fork',  left: '42%', delay: '4s',     duration: '8s',   scale: 0.9, opacity: 0.7 },
  { type: 'spoon', left: '56%', delay: '1s',     duration: '6s',   scale: 1.0, opacity: 0.35 },
  { type: 'fork',  left: '30%', delay: '3.5s',   duration: '9s',   scale: 1.1, opacity: 0.7 },
] as const;

// 로그인 배경 장식 — 포크·나이프가 위에서 내려오는 애니메이션 (aria-hidden)
export function CutleryRain() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {RAIN_ITEMS.map((item, i) => {
        const Icon = ICON_MAP[item.type];
        return (
          <div
            key={i}
            className="absolute -top-12"
            style={{ left: item.left, transform: `scale(${item.scale})` }}
          >
            <div
              className="animate-cutlery-fall will-change-transform text-palette-brand"
              style={{
                animationDelay: item.delay,
                animationDuration: item.duration,
                opacity: item.opacity,
              }}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
