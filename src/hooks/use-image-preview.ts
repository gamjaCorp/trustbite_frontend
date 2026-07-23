import { useState, useRef, useCallback } from 'react';

// 단일 이미지 파일 선택 → object URL 미리보기 관리 훅 (edit-profile-dialog, onboarding 공용)
export function useImagePreview(initialUrl?: string) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const pendingBlobRef = useRef<string | undefined>(undefined);

  const revokePending = useCallback(() => {
    if (pendingBlobRef.current) {
      URL.revokeObjectURL(pendingBlobRef.current);
      pendingBlobRef.current = undefined;
    }
  }, []);

  // 파일 input onChange 핸들러 — object URL 생성 후 onFileSelected 콜백 호출
  const handleFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onFileSelected?: (file: File) => void,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      revokePending();
      const url = URL.createObjectURL(file);
      pendingBlobRef.current = url;
      setPreviewUrl(url);
      onFileSelected?.(file);
      e.target.value = '';
    },
    [revokePending],
  );

  return { previewUrl, setPreviewUrl, handleFileChange, revokePending };
}
