import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  step: number;
  totalSteps?: number;
  left: ReactNode;
  right: ReactNode;
}

export function AuthLayout({ step, totalSteps = 2, left, right }: Props) {
  return (
    <main className="min-h-screen md:flex">
      <section className="md:flex-1 bg-primary-subtle px-8 md:px-12 lg:px-16 py-12 md:py-14 flex flex-col">
        <div className="w-full max-w-md mx-auto flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background">
            <ShieldCheck className="w-5 h-5" strokeWidth={2.25} />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            TrustBite
          </span>
        </div>
        <div className="mt-10 md:mt-12 flex-1 flex flex-col">{left}</div>
      </section>

      <section className="md:flex-1 bg-background px-8 md:px-12 lg:px-16 py-12 md:py-14 flex flex-col">
        <div className="w-full max-w-md mx-auto">
          <StepIndicator step={step} total={totalSteps} />
        </div>
        <div className="mt-10 md:mt-12 flex-1 flex flex-col">{right}</div>
      </section>
    </main>
  );
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'w-10 h-0.5 rounded-full',
              i < step ? 'bg-foreground' : 'bg-foreground/20',
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium">
        Step {step} of {total}
      </span>
    </div>
  );
}
