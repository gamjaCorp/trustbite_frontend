import Link from 'next/link';
import { ChevronRight, Eye } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GradeBadge } from '@/components/common/grade-badge';
import type { MyProfile } from '@/types/user';

interface Props {
  profile: MyProfile;
}

export function ProfileSummaryCard({ profile }: Props) {
  return (
    <section className="rounded-2xl bg-card shadow-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-primary-subtle text-primary text-base font-bold">
              {profile.avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-foreground truncate">
                {profile.name}
              </span>
              <GradeBadge grade={profile.currentGrade} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {profile.email} · {profile.joinedAt}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 rounded-full">
          편집
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
          >
            <span className="font-numeric font-bold">{profile.followerCount}</span>
            <span className="text-muted-foreground">팔로워</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
          >
            <span className="font-numeric font-bold">{profile.followingCount}</span>
            <span className="text-muted-foreground">팔로잉</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
        <Link
          href="/my"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>내 미식 가이드 보기</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </section>
  );
}
