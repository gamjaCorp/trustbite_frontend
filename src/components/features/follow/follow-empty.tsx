// 팔로워/팔로잉 목록이 비어 있을 때 표시하는 상태 컴포넌트
import { Users } from 'lucide-react';

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import type { FollowTabKey } from '@/lib/types/follow/type';

interface Props {
  mode: 'self' | 'other';
  tab: FollowTabKey;
  subjectName?: string;
}

const MESSAGES: Record<'self' | 'other', Record<FollowTabKey, { title: string; desc: string }>> = {
  self: {
    followers: {
      title: '아직 팔로워가 없어요',
      desc: '맛집 기록을 쌓으면 나를 팔로우하는 사람이 생겨요.',
    },
    following: {
      title: '아직 팔로우한 사람이 없어요',
      desc: '신뢰할 수 있는 미식가를 팔로우하고 맛집 정보를 얻어보세요.',
    },
  },
  other: {
    followers: {
      title: '팔로워가 아직 없어요',
      desc: '',
    },
    following: {
      title: '아직 팔로우한 사람이 없어요',
      desc: '',
    },
  },
};

export function FollowEmpty({ mode, tab, subjectName }: Props) {
  const msg = MESSAGES[mode][tab];
  const title =
    mode === 'other' && subjectName
      ? tab === 'followers'
        ? `${subjectName}님의 팔로워가 아직 없어요`
        : `${subjectName}님은 아직 아무도 팔로우하지 않았어요`
      : msg.title;

  return (
    <Empty className="border-0 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle className="text-body-1">{title}</EmptyTitle>
        {msg.desc && <EmptyDescription>{msg.desc}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  );
}
