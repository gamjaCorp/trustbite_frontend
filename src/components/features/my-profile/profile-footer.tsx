export function ProfileFooter() {
  return (
    <footer className="pt-4 text-center text-caption-2 text-muted-foreground">
      <span>TrustBite v1.0.0</span>
      <span className="mx-1.5">·</span>
      <button type="button" className="hover:text-foreground transition-colors">
        이용약관
      </button>
      <span className="mx-1.5">·</span>
      <button type="button" className="hover:text-foreground transition-colors">
        개인정보처리방침
      </button>
    </footer>
  );
}
