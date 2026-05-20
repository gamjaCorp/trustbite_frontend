'use client';

// 다크 모드 토글 설정 행
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { ProfileListRow } from './profile-list-row';

export function ThemeSettingRow() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ProfileListRow
      label="다크 모드"
      rightSlot={
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          aria-label="다크 모드 토글"
        />
      }
    />
  );
}
