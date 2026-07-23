// TODO: 1차 MVP 제외 — 약관·개인정보 링크 (약관 페이지 미존재)
export function ProfileFooter() {
  return (
    <footer className="pt-4 text-center text-caption-2 text-muted-foreground">
      <span>TrustBite v1.0.0</span>
      <span className="mx-1.5">·</span>
      <span aria-disabled="true" className="opacity-35 cursor-not-allowed">
        이용약관
      </span>
      <span className="mx-1.5">·</span>
      <span aria-disabled="true" className="opacity-35 cursor-not-allowed">
        개인정보처리방침
      </span>
    </footer>
  );
}
