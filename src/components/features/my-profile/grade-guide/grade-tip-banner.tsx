import { Lightbulb } from 'lucide-react';

export function GradeTipBanner() {
  return (
    <div className="bg-primary-subtle px-8 py-4 flex items-center gap-3">
      <Lightbulb className="w-4 h-4 text-primary shrink-0" />
      <p className="text-body-2 text-foreground">
        사진 첨부와 100자 이상 작성이 신뢰도를 가장 빠르게 올려요
      </p>
    </div>
  );
}
