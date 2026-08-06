import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<AvatarSize, { avatar: string; fallback: string }> = {
  xs: { avatar: 'h-5 w-5',   fallback: 'text-label-3' },
  sm: { avatar: 'h-8 w-8',   fallback: 'text-label-3' },
  md: { avatar: 'h-10 w-10', fallback: 'text-title-3' },
  lg: { avatar: 'h-12 w-12', fallback: 'text-title-1' },
  xl: { avatar: 'h-20 w-20', fallback: 'text-headline-1' },
};

interface Props {
  initial: string; // 표시할 이니셜 (보통 이름 첫 글자)
  imageUrl?: string; // 프로필 이미지 URL — 없으면 이니셜 fallback 표시
  size: AvatarSize;
  className?: string;
}

// 유저 아바타 — bg-primary-subtle 이니셜 fallback + 선택적 이미지
export function UserAvatar({ initial, imageUrl, size, className }: Props) {
  const { avatar, fallback } = SIZE[size];
  return (
    <Avatar className={cn(avatar, 'shrink-0', className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt="" />}
      <AvatarFallback className={cn('bg-primary-subtle text-primary font-semibold', fallback)}>
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
