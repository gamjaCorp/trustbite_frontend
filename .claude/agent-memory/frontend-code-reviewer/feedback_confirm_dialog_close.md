---
name: feedback_confirm_dialog_close
description: ConfirmDialog primaryAction onClick 경로에서 다이얼로그 자동 닫힘 없음 — 호출부가 onOpenChange(false) 직접 호출해야 함
metadata:
  type: feedback
---

`ConfirmDialog`의 `primaryAction.onClick` 경로(non-href)에는 `DialogClose`로 감싸지 않아 버튼 클릭 후 다이얼로그가 자동으로 닫히지 않음.

**Why:** shadcn `Dialog`는 overlay 클릭·ESC로만 자동 닫힘. 버튼 클릭은 호출부에서 `onOpenChange(false)` 명시 필요.

**How to apply:** ConfirmDialog를 사용하는 모든 호출부(DeleteReviewDialog 등)는 `onClick` 핸들러 내에서 반드시 `onOpenChange(false)`를 호출해야 함. API 문서/주석에 이 제약 명시 권장. [[feedback_tap_target_size]]
